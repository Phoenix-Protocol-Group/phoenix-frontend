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
  "https://bitter-alpha-layer.stellar-mainnet.quiknode.pro/54b50c548864e1470fd52dbd629b647d556b983e";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CC3AWJG5I7P5VMTBCPYCAGCQOSKDBQK6NWS4G4KQ3FWXJZT6FTCSLRYY";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CBLGRAHJ4OJ2TOQYQ4W2HCHXMQCEIUTP6DWKTH2OHS7FKKF3TZGYC7FW";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";
