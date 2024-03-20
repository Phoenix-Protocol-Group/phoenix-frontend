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
  "CADJ3ZNL2RK3RNGHTXHKQ52HAKKD3464TOR7GPFFXJZXBK5HQNOTXOGT";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CC2SBQPA2RYC6U7QBR2EEV4CDCQUD2LOIQ7WVJHL3AU6JPUJYIFETARQ";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";

/**
 * Reflector contract address
 */
export const REFLECTOR_ADDRESS: string = 
  "CA2NWEPNC6BD5KELGJDVWWTXUE7ASDKTNQNL6DN3TGBVWFEWSVVGMUAF";
