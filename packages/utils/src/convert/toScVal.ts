import BigNumber from "bignumber.js";
import * as SorobanClient from "soroban-client";
import { bigNumberToI128 } from "./numbers";
let xdr = SorobanClient.xdr;

export function scvalToString(
  value: SorobanClient.xdr.ScVal
): string | undefined {
  return value.bytes().toString();
}

// Function to convert an array of params to scvals
export function paramsToScVals(
  params: (string | number | BigNumber)[]
): SorobanClient.xdr.ScVal[] {
  return params.map((p) => {
    if (typeof p === "string") {
      return xdr.ScVal.scvBytes(Buffer.from(p));
    } else if (typeof p === "number") {
      return xdr.ScVal.scvI32(p);
    } else if (p instanceof BigNumber) {
      return bigNumberToI128(p);
    } else {
      throw new Error(`Invalid param type: ${typeof p}`);
    }
  });
}
