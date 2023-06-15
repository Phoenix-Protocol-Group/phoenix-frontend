// Export walletProvider types
export {
  ChainName,
  ChainMetadata,
  Connector,
  InstructionStepName,
  NetworkDetails,
  WalletChain,
} from "./providers/walletProvider/types";

// Export freighter
export { freighter } from "./providers/walletProvider/freighter";

// Export chains
export {
  public_chain,
  futurenet,
  testnet,
  sandbox,
  standalone,
} from "./providers/walletProvider/chains";

// Export walletProvider
export { WalletProvider } from "./providers/walletProvider";

// Export PhoenixProvider
export { PhoenixProvider } from "./providers/phoenixProvider";
