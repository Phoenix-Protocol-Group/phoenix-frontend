import BigNumber from "bignumber.js";
import { convert } from "@phoenix-protocol/utils";
import { fetchContractValue } from "../soroban";
import { server, networkPassphrase, source, contractIds } from "./constants";

describe("Pair Client", () => {
  it("Query - query_pool_info works", async () => {
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
});
