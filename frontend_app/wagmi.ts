import { configureChains, createConfig, sepolia } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy';

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID; // Your Alchemy ID

const { chains, publicClient:customPublicClient, webSocketPublicClient:customWebSocketPublicClient } = configureChains(
  [mainnet, goerli,sepolia],
  [
    alchemyProvider({apiKey:alchemyId}), // Use Alchemy provider
    publicProvider()
  ],
)

export const config = createConfig(
  
  getDefaultConfig({
    // Required API Keys
    alchemyId: alchemyId, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    // Required
    appName: "Ethhack",
    publicClient:customPublicClient,
    chains:chains,
    webSocketPublicClient:customWebSocketPublicClient
  })
)