import { Account } from "@stellar/stellar-sdk";

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
  "CB4SVAWJA6TSRNOJZ7W2AWFW46D5VR4ZMFZKDIKXEINZCZEGZCJZCKMI";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPYJGU2IO2G";

/**
 * Phoenix History Indexer
 */
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";

export const DECENTRIO_API_URL: string =
  "https://api-phoenix-test.decentrio.ventures";

/**
 * Airdrop program
 */
export const AIRDROP_POOL_ADDRESSES: string[] = [
  "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
  "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
  "CAZ6W4WHVGQBGURYTUOLCUOOHW6VQGAAPSPCD72VEDZMBBPY7H43AYEC",
];

/**
 * Vesting contract address
 */
export const VESTING_ADDRESS: string =
  "CDEGWCGEMNFZT3UUQD7B4TTPDHXZLGEDB6WIP4PWNTXOR5EZD34HJ64O";
