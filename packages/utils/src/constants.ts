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
  "CDZWS4BULHRHKO4AKXRF6CUBHQIPKWD2XJU763ECZYAQOLSTFNWKXIBL";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CDB6Z2MYCCHWPGQPXLOKVDEGTA3JXJPYAU5OTVUO5YEOQDOZG4IWDG27";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://history.phoenix-hub.io";
