import { fetchContractValue } from "@phoenix-protocol/state/src/hooks/contracts";
import {
  Server,
  xdr,
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

const server: Server = new Server("https://rpc-futurenet.stellar.org/");
const networkPassphrase: string = Networks.TESTNET;
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
    const scVal = await fetchContractValue({
      server,
      networkPassphrase,
      contractId: contractIds.pair,
      method: "query_pool_info",
      params: [],
      source,
    });

    const decodedScVal: any = convert.scValToJs(scVal);

    expect(decodedScVal?.asset_a.get("address")).toEqual(expect.any(String));
    expect(decodedScVal?.asset_a.get("amount")).toBeInstanceOf(BigNumber);
  });

  it("Asset - balance works", async () => {
    const scVal = await fetchContractValue({
      server,
      networkPassphrase,
      contractId: contractIds.asset,
      method: "balance",
      params: [new SorobanAddress(source.accountId()).toScVal()],
      source,
    });

    const decodedScVal: any = convert.scValToJs(scVal);
    expect(decodedScVal).toBeInstanceOf(BigNumber);
  });
});
