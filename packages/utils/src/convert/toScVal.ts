import BigNumber from "bignumber.js";
import * as SorobanClient from "soroban-client";
import { bigNumberToI128 } from "./numbers";
let xdr = SorobanClient.xdr;

export function scvalToString(
  value: SorobanClient.xdr.ScVal
): string | undefined {
  // `value.bytes()` returns a `Buffer` object.
  // Use `toString()` to convert it to a string.
  return value.bytes().toString();
}

// Function to convert an array of params to scvals
export function paramsToScVals(params: (string | number | BigNumber)[]) {
  return params.map((p) => {
    // If the param is a string, encode it as bytes
    if (typeof p === "string") {
      return xdr.ScVal.scvBytes(Buffer.from(p));
    }
    // If the param is a number, encode it as an i32
    else if (typeof p === "number") {
      return xdr.ScVal.scvI32(p);
    }
    // If the param is a BigNumber, encode it as an i128
    else if (p instanceof BigNumber) {
      return bigNumberToI128(p);
    } else {
      throw new Error(`Invalid param type: ${typeof p}`);
    }
  });
}