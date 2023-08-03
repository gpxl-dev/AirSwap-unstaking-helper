import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { StakingMigrationPage } from "./pages/StakingMigration";

const chains = [arbitrum, mainnet, polygon];
const walletConnectCloudProjectId = import.meta.env.VITE_APP_PROJECT_ID!;

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: walletConnectCloudProjectId }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: walletConnectCloudProjectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <StakingMigrationPage />
      </WagmiConfig>
      <Web3Modal
        projectId={walletConnectCloudProjectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
