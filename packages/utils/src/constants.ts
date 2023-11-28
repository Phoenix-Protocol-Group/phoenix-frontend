import { Account } from "soroban-client";

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
export const RPC_URL: string = "https://soroban-testnet.stellar.org:443";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CAO3QRJ36VDS5IIA3XFO6EQTWFRDDB6SUYYXCKMTVIQRS75NSVLRRRRQ";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CC4W4EIZMCCUG2R5FHQGQDSBZY6S2V2CIIJQZ5XBXCKUVVSBR7HC6267";
