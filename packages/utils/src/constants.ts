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
  "CDM4B5WKRBXZUWUAGSXR5NPMPOVUGG53WVRGRAOSSNSOPAYO4AQEYIIB";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CCTZUXAKGKD7T6FVDEGEKQHDSLQIXMMNPLH7P6OI5GD5B32LHVKUQQ7F";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graph.phoenix-hub.io";
