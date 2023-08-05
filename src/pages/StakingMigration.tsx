import { Web3Button } from "@web3modal/react";
import { BalanceAndUnstake } from "../components/BalanceAndUnstake";
import { useAccount, useBalance, useContractWrite } from "wagmi";
import { parseAbiItem } from "viem";

const LEGACY_CONTRACTS: {
  address: `0x${string}`;
  label: string;
  unstakeConfig: Parameters<typeof useContractWrite>[0];
}[] = [
  {
    address: "0x704c5818B574358dFB5225563852639151a943ec",
    label: "Deprecated v2 Staking",
    unstakeConfig: {
      abi: [
        parseAbiItem("function unstake(uint256[] calldata amounts)"),
      ] as const,
      functionName: "unstake",
    },
  },
  {
    address: "0x579120871266ccd8De6c85EF59E2fF6743E7CD15",
    label: "V2 Staking",
    unstakeConfig: {
      abi: [
        parseAbiItem("function unstake(uint256[] calldata amounts)"),
      ] as const,
      functionName: "unstake",
    },
  },
  {
    address: "0xa4C5107184a88D4B324Dd10D98a11dd8037823Fe",
    label: "Legacy v2 Staking",
    unstakeConfig: {
      abi: [parseAbiItem("function unlock(uint256 amount)")] as const,
      functionName: "unlock",
    },
  },
  {
    address: "0x6d88B09805b90dad911E5C5A512eEDd984D6860B",
    label: "Legacy v3 Staking",
    unstakeConfig: {
      abi: [parseAbiItem("function unstake(uint256 amount)")] as const,
      functionName: "unstake",
    },
  },
];

export const StakingMigrationPage = ({}: {}) => {
  const { address } = useAccount();
  const { data: astBalance } = useBalance({
    address,
    chainId: 1,
    token: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
    watch: true,
  });

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">
      <header className="w-full flex flex-row justify-between items-center">
        <h1 className="text-lg font-bold white [text-wrap:balance]">
          Unofficial AirSwap Staking migration helper
        </h1>
        <Web3Button />
      </header>

      <div>
        <p>
          <span className="font-semibold">Current Unstaked AST Balance:</span>{" "}
          {astBalance?.formatted} AST{" "}
        </p>
      </div>

      <div
        className="grid gap-4 items-center"
        style={{
          gridTemplateColumns: "auto auto auto",
        }}
      >
        <div className="font-bold">Contract</div>
        <div className="font-bold text-right">Balance</div>
        <div className="font-bold">&nbsp;</div>

        {LEGACY_CONTRACTS.map(({ label, address, unstakeConfig }) => (
          <BalanceAndUnstake
            key={address}
            contractAddress={address}
            contractLabel={label}
            unstakeConfig={unstakeConfig}
          />
        ))}
      </div>
    </div>
  );
};
