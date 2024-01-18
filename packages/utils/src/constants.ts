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
  "CCWKMFZ356WOTIELP6TKR2Y3LERRA6VURXB7ZY44BFO45HNZRQWGO4YF";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CD6WK4FXZSVES5NTITEOZUPVZ6AJGVFFUACEJO63JX35ODDFKTJ6ZIUI";
