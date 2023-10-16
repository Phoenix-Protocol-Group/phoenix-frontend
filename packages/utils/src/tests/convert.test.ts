import * as convert from "../convert";
import {
  xdr,
  Address,
  nativeToScVal,
  scValToBigInt,
  ScInt,
} from "soroban-client";
import * as constants from "../constants";

(ScInt.prototype.toI128 as jest.Mock) = jest.fn().mockReturnValue("mockI128");
(ScInt.prototype.toU128 as jest.Mock) = jest.fn().mockReturnValue("mockU128");

describe("convert", () => {
  it("i128ToScVal should create a new ScInt and call toI128", () => {
    convert.i128ToScVal(BigInt(128));
    expect(ScInt.prototype.toI128).toHaveBeenCalled();
  });

  it("u128ToScVal should create a new ScInt and call toU128", () => {
    convert.u128ToScVal(BigInt(128));
    expect(ScInt.prototype.toU128).toHaveBeenCalled();
  });
});

describe("scValToJs", () => {
  it("should handle scvBool type", () => {
    const mockVal = nativeToScVal(true);
    const result = convert.scValToJs<boolean>(mockVal);
    expect(result).toBe(true);
  });

  it("should handle scvVoid type", () => {
    const mockVal = xdr.ScVal.scvVoid();
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(0);
  });

  it("should handle scvU32 type", () => {
    const mockVal = xdr.ScVal.scvU32(32);
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(32);
  });

  it("should handle scvI32 type", () => {
    const mockVal = xdr.ScVal.scvI32(-32);
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(-32);
  });

  it("should handle scvAddress type", () => {
    const mockVal = new Address(constants.TESTING_SOURCE.accountId()).toScVal();
    const result = convert.scValToJs<string>(mockVal);
    expect(result).toBe(constants.TESTING_SOURCE.accountId());
  });

  it("should handle scvString type", () => {
    const mockVal = xdr.ScVal.scvString("example");
    const result = convert.scValToJs<string>(mockVal);
    expect(result).toBe("example");
  });

  //! TODO Similarly add tests for all other cases in the switch statement
});
