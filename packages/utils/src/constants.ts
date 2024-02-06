import { Account } from "stellar-sdk";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE: string = "Test SDF Network ; September 2015";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string = "https://soroban-testnet.stellar.org";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CCSEJ3X2OSSXMJQZ3TI7F7LY4ASSUQZCZSZUMTK6NCTF7HEAU7KB5R2P";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CD7BZSTB5PVTGWCYHLUUVFHA2SB2AB3BACUG7ZRDFJQTDMHESJMOYSQY";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://history.phoenix-hub.io";
