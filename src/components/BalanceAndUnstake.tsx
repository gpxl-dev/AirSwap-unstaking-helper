import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect } from "react";
import deprecatedV2Staking from "../abis/deprecatedV2Staking";

export const BalanceAndUnstake = ({
  contractAddress,
  contractLabel,
  unstakeConfig,
}: {
  contractAddress: `0x${string}`;
  contractLabel: string;
  unstakeConfig: Parameters<typeof useContractWrite>[0];
}) => {
  // This contract needs different args.
  const isDeprecatedV2Staking =
    contractAddress === "0x704c5818B574358dFB5225563852639151a943ec";

  const { address, isConnected } = useAccount();

  const { data: balance, isFetched } = useBalance({
    address: address,
    token: contractAddress,
    chainId: 1,
    watch: true,
  });

  const { data: deprecatedStakes } = useContractRead({
    abi: deprecatedV2Staking,
    address: contractAddress,
    functionName: "getStakes",
    args: [address!],
    enabled: isDeprecatedV2Staking && isConnected,
  });

  const hasBalance = isFetched && (balance?.value || 0n) > 0n;

  const { write, isLoading, isSuccess, isError, error, reset } =
    useContractWrite({
      ...unstakeConfig,
      // @ts-ignore
      address: contractAddress,
      // @ts-ignore
      args: [
        isDeprecatedV2Staking
          ? deprecatedStakes?.map((s) => s.balance) || []
          : balance?.value || 0n,
      ],
    });

  useEffect(() => {
    if (isError) {
      // @ts-ignore
      if (error?.shortMessage === "User rejected the request.") {
        reset();
      }
    }
  }, [isError, error, reset]);

  return (
    <>
      <div className="flex flex-col">
        <span>{contractLabel}</span>
        <a
          href={`https://etherscan.io/address/${contractAddress}`}
          className="text-xs text-gray-400 font-mono underline hover:text-gray-50"
          target="_blank"
          rel="noreferrer"
        >
          {contractAddress}
        </a>
      </div>
      <div className="text-right">
        {isConnected ? (
          <div>{balance?.formatted}</div>
        ) : (
          <div className="text-gray-400 text-xs">Connect your wallet</div>
        )}
      </div>
      <div className="justify-self-end">
        {hasBalance && !isSuccess && !isError && (
          <button
            disabled={!isConnected || isLoading}
            onClick={() => !isLoading && write()}
            className=" active:bg-violet-500 hover:bg-violet-300 bg-violet-400 rounded-md text-slate-50 font-semibold px-4 py-1 transition-colors disabled:text-opacity-50 flex flex-row items-center gap-2"
          >
            <span>{isLoading ? "Unstaking" : "Unstake"}</span>
            {isLoading && (
              <AiOutlineLoading3Quarters className="animate-spin" />
            )}
          </button>
        )}
        {isSuccess && <span>Unstaking complete!</span>}
        {isError && (
          <div className="flex flex-col">
            <span className="font-semibold">Something went wrong...</span>
            {/* @ts-ignore */}
            <span className="text-xs text-red-400">{error!.shortMessage}</span>
          </div>
        )}
      </div>
    </>
  );
};
