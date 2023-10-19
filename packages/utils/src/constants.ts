import { Account } from "soroban-client";

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE: string =
  "Test SDF Future Network ; October 2022";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string = "https://rpc-futurenet.stellar.org:443";

/**
 * Factory contract address
 */
export const FACTORY_ADDRESS: string =
  "CB7GJAEMLIE6BTDALAFESLLECPQOXWDMYTYNCWVTTBXC255LZUDXJOCK";

/**
 * Multihop contract address
 */
export const MULTIHOP_ADDRESS: string =
  "CCRAGFMLC3VN3RF7Q7UJMTLA3U2RBA4AL6EOQDFSBMLFHTTOYEM3V57L";
