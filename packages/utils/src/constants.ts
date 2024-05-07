import { Account } from "stellar-sdk";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE: string =
  "Public Global Stellar Network ; September 2015";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string =
"https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CDL4NNRQKFUCDJOBWVZR2LQWIPDKQHV2V6LUG5DBZ25R4KIAJ3EEGADU"

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CDVEV72XNPR2TD554BZ7CQIR6P5APNWVRK2OFI3I2DFCSSEN3KAZAEU2";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";
