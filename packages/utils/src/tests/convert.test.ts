import { fetchContractValue } from "@phoenix-protocol/state/src/hooks/contracts";
import {
  Server,
  Networks,
  Account,
  Address as SorobanAddress,
} from "soroban-client";
import { convert } from "..";
import BigNumber from "bignumber.js";

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export type Timestamp = bigint;

// The server we will connect to.
const server: Server = new Server("https://rpc-futurenet.stellar.org/");

// The passphrase of the Stellar network that we will be using.
const networkPassphrase: string = Networks.TESTNET;

// The source account that will be used to send the payment.
const source: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

const contractIds = {
  pair: "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae",
  asset: "984af61b50b042c0dad2f30b369513b12bf4b2f0b705e0165fce57c2105b7523",
};

describe("XDR Decoding & Querying", () => {
  it("Pair - query_pool_info works", async () => {
    // Fetch the pool info from the smart contract.
    const scVal = await fetchContractValue({
      server,
      networkPassphrase,
      contractId: contractIds.pair,
      method: "query_pool_info",
      params: [],
      source,
    });

    // Decode the pool info from the smart contract.
    const decodedScVal: any = convert.scValToJs(scVal);

    // Expect the asset a address to be a string.
    expect(decodedScVal?.asset_a.get("address")).toEqual(expect.any(String));

    // Expect the asset a amount to be a BigNumber.
    expect(decodedScVal?.asset_a.get("amount")).toBeInstanceOf(BigNumber);
  });

  it("Asset - balance works", async () => {
    // get balance of the source account for the asset
    const sourceAccountAddress = new SorobanAddress(
      source.accountId()
    ).toScVal();
    const scVal = await fetchContractValue({
      server,
      networkPassphrase,
      contractId: contractIds.asset,
      method: "balance",
      params: [sourceAccountAddress],
      source,
    });

    // decode the balance
    const decodedScVal: any = convert.scValToJs(scVal);

    // ensure the balance is a BigNumber
    expect(decodedScVal).toBeInstanceOf(BigNumber);
  });
});
