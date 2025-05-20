import { Account } from "@stellar/stellar-sdk";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

// Network selection
export const isTestnet = process.env.NEXT_PUBLIC_TESTNET === "true";

// Network configuration
export const NETWORK_PASSPHRASE: string = isTestnet
  ? "Test SDF Network ; September 2015" // Testnet passphrase
  : "Public Global Stellar Network ; September 2015"; // Mainnet passphrase

export const RPC_URL: string = isTestnet
  ? "https://soroban-testnet.stellar.org" // Testnet RPC
  : "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0"; // Mainnet RPC

// Contract addresses
export const FACTORY_ADDRESS: string = isTestnet
  ? "CDNX3D7XRBAWS5SGAEWG6K5U3EM5JJNKILK4SQYL37MBCJR5RZQGFGKQ" // Testnet
  : "CB4SVAWJA6TSRNOJZ7W2AWFW46D5VR4ZMFZKDIKXEINZCZEGZCJZCKMI"; // Mainnet

export const MULTIHOP_ADDRESS: string = isTestnet
  ? "CBGE6JDNQA4NXQ2HO2XGXFR2QDUQRJHLFKS2TRSTNUSEXM7Y5VAYM2CJ" // Testnet
  : "CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPYJGU2IO2G"; // Mainnet

// Service endpoints (same for both networks)
export const PHOENIX_HISTORY_INDEXER: string = "https://graphql.phoenix-hub.io";
export const DECENTRIO_API_URL: string =
  "https://api-phoenix-v2.decentrio.ventures";
export const TRADING_API_URL: string = "https://trades.phoenix-hub.io";

// Airdrop pool addresses (same for both networks)
export const AIRDROP_POOL_ADDRESSES: string[] = [
  "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
  "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
  "CAZ6W4WHVGQBGURYTUOLCUOOHW6VQGAAPSPCD72VEDZMBBPY7H43AYEC",
];

// Vesting contract address (same for both networks)
export const VESTING_ADDRESS: string =
  "CDEGWCGEMNFZT3UUQD7B4TTPDHXZLGEDB6WIP4PWNTXOR5EZD34HJ64O";
