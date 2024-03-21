import { Account } from "stellar-sdk";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE: string = "Public Global Stellar Network ; September 2015";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string =
  "https://bitter-alpha-layer.stellar-mainnet.quiknode.pro/54b50c548864e1470fd52dbd629b647d556b983e";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CARVO4GFHVVHSNJQUJGWINRNTL3Z6LRR3YIL54LGQSDWO4LHXCY5IMCZ";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CAWSSOOXES5AGPV3Y35A65CJNWNPGUO4OUFGGSEFCUWL4LDHC3EPSJAA";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";
