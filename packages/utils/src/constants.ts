import { Account } from "soroban-client";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE = "Test SDF Future Network ; October 2022";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string =
  "https://rpc-futurenet.stellar.org:443";
