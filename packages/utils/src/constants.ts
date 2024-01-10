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
export const RPC_URL: string =
  "https://clean-spring-log.stellar-testnet.quiknode.pro/6989aedb39f9eb5f05808feb99d9eecb6c26c8ce/";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CC7M2QFZWG5OZ6DLEAOHN5OULALNOQMRWWRWSE5HJCZPI3W2L5DMJHLB";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CCIEUAD63OGWJ3FKBI5SZG7HZ34PPYF4RCPWVB5SOP6G7FBBNAVPYHKW";
