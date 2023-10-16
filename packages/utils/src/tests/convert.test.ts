import * as convert from "../convert";
import { xdr, Address, nativeToScVal, ScInt } from "soroban-client";
import * as constants from "../constants";

// Mock ScInt methods for testing
(ScInt.prototype.toI128 as jest.Mock) = jest.fn().mockReturnValue("mockI128");
(ScInt.prototype.toU128 as jest.Mock) = jest.fn().mockReturnValue("mockU128");

// Group of tests for functions in 'convert' module
describe("convert", () => {
  // Test for i128ToScVal function
  it("i128ToScVal should create a new ScInt and call toI128", () => {
    convert.i128ToScVal(BigInt(128));
    expect(ScInt.prototype.toI128).toHaveBeenCalled();
  });

  // Test for u128ToScVal function
  it("u128ToScVal should create a new ScInt and call toU128", () => {
    convert.u128ToScVal(BigInt(128));
    expect(ScInt.prototype.toU128).toHaveBeenCalled();
  });
});

// Group of tests for the scValToJs function
describe("scValToJs", () => {
  // Test for scvBool type
  it("should handle scvBool type", () => {
    const mockVal = nativeToScVal(true);
    const result = convert.scValToJs<boolean>(mockVal);
    expect(result).toBe(true);
  });

  // Test for scvVoid type
  it("should handle scvVoid type", () => {
    const mockVal = xdr.ScVal.scvVoid();
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(0);
  });

  // Test for scvU32 type
  it("should handle scvU32 type", () => {
    const mockVal = xdr.ScVal.scvU32(32);
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(32);
  });

  // Test for scvI32 type
  it("should handle scvI32 type", () => {
    const mockVal = xdr.ScVal.scvI32(-32);
    const result = convert.scValToJs<number>(mockVal);
    expect(result).toBe(-32);
  });

  // Test for scvAddress type
  it("should handle scvAddress type", () => {
    const mockVal = new Address(constants.TESTING_SOURCE.accountId()).toScVal();
    const result = convert.scValToJs<string>(mockVal);
    expect(result).toBe(constants.TESTING_SOURCE.accountId());
  });

  // Test for scvString type
  it("should handle scvString type", () => {
    const mockVal = xdr.ScVal.scvString("example");
    const result = convert.scValToJs<string>(mockVal);
    expect(result).toBe("example");
  });

  // TODO: Add tests for all other cases in the switch statement
});
