import { Address as SorobanAddress } from "soroban-client";
import BigNumber from "bignumber.js";
import { convert } from "@phoenix-protocol/utils";
import { fetchContractValue } from "../soroban";
import { server, networkPassphrase, source, contractIds } from "./constants";

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

describe("Token Client", () => {
  it("Query - balance works", async () => {
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
