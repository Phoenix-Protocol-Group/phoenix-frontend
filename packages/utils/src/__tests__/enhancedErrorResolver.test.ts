import {
  resolveContractErrorEnhanced,
  extractErrorCodeFromMessage,
} from "../enhancedErrorResolver";

describe("Enhanced Error Resolver", () => {
  describe("extractErrorCodeFromMessage", () => {
    it("should extract error codes from standard Soroban error format", () => {
      const result = extractErrorCodeFromMessage("Error(Contract, #10)");
      expect(result).toEqual({ code: 10 });
    });

    it("should extract error codes from HostError format", () => {
      const result = extractErrorCodeFromMessage(
        "HostError: Error(Contract, #300)"
      );
      expect(result).toEqual({ code: 300 });
    });

    it("should extract error codes from transaction simulation failed format", () => {
      const result = extractErrorCodeFromMessage(
        "Transaction simulation failed: HostError: Error(Contract, #101)"
      );
      expect(result).toEqual({ code: 101 });
    });

    it("should extract error codes from complex transaction simulation with event logs", () => {
      const complexError =
        'Transaction simulation failed: "HostError: Error(Contract, #300) Event log (newest first): 0: [Diagnostic Event] contract:CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPHJGU2IO2G, topics:[error, Error(Contract, #300)], data:"escalating error to VM trap from failed host function call: call"';
      const result = extractErrorCodeFromMessage(complexError);
      expect(result).toEqual({ code: 300 });
    });

    it("should extract error codes from event log data", () => {
      const eventLogError =
        'topics:[error, Error(Contract, #300)], data:["failing with contract error", 300]';
      const result = extractErrorCodeFromMessage(eventLogError);
      expect(result).toEqual({ code: 300 });
    });

    it("should return null for messages without error codes", () => {
      const result = extractErrorCodeFromMessage("Generic error message");
      expect(result).toBeNull();
    });
  });

  describe("resolveContractErrorEnhanced", () => {
    it("should resolve factory contract errors correctly", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #100)");
      expect(result.userFriendlyMessage).toBe(
        "The selected token is not supported. Please choose a different token."
      );
      expect(result.errorCode).toBe(100);
    });

    it("should resolve pair contract errors correctly", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #300)");
      expect(result.userFriendlyMessage).toContain(
        "price difference is too high"
      );
      expect(result.errorCode).toBe(300);
    });

    it("should resolve stake contract errors correctly", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #500)");
      expect(result.userFriendlyMessage).toBe(
        "The staking system is not ready yet. Please try again later."
      );
      expect(result.errorCode).toBe(500);
    });

    it("should resolve multihop contract errors correctly", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #200)");
      expect(result.userFriendlyMessage).toBe(
        "The multi-step trading system is not ready yet. Please try again later."
      );
      expect(result.errorCode).toBe(200);
    });

    it("should resolve vesting contract errors correctly", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #700)");
      expect(result.userFriendlyMessage).toBe(
        "The token vesting system is not ready yet. Please try again later."
      );
      expect(result.errorCode).toBe(700);
    });

    it("should handle unknown error codes gracefully", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #999)");
      expect(result.userFriendlyMessage).toContain(
        "Something went wrong (error code: 999)"
      );
      expect(result.errorCode).toBe(999);
    });

    it("should handle messages without error codes", () => {
      const result = resolveContractErrorEnhanced("Generic network error");
      expect(result.userFriendlyMessage).toContain(
        "Something unexpected happened"
      );
      expect(result.errorCode).toBeNull();
    });

    it("should infer contract type from error code ranges", () => {
      const result = resolveContractErrorEnhanced("Error(Contract, #300)");
      expect(result.contractType).toBe("pair");
      expect(result.userFriendlyMessage).toContain(
        "price difference is too high"
      );
    });

    it("should infer contract type from context when error code is unknown", () => {
      const result = resolveContractErrorEnhanced(
        "Liquidity pool error: Error(Contract, #999)"
      );
      expect(result.contractType).toBe("pair");
      expect(result.userFriendlyMessage).toContain(
        "Something went wrong (error code: 999)"
      );
    });

    it("should preserve technical details", () => {
      const errorMessage =
        "Transaction simulation failed: HostError: Error(Contract, #101)";
      const result = resolveContractErrorEnhanced(errorMessage);
      expect(result.technicalDetails).toBe(errorMessage);
      expect(result.userFriendlyMessage).toBe(
        "This token pair already exists. You can find it in the pools section."
      );
    });

    it("should handle real-world complex transaction simulation errors", () => {
      const complexRealError =
        'Transaction simulation failed: "HostError: Error(Contract, #300) Event log (newest first): 0: [Diagnostic Event] contract:CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPHJGU2IO2G, topics:[error, Error(Contract, #300)], data:"escalating error to VM trap from failed host function call: call" 1: [Diagnostic Event] contract:CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPHJGU2IO2G, topics:[error, Error(Contract, #300)], data:["contract call failed", swap, [GAPRPZYCIV3QPMCTWSRDNY64EJMZNCJFUCTJHQDQNW6RJ66TEVEH5UDU, CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA, 60000000000, Void, 100, Void, Void]]';
      const result = resolveContractErrorEnhanced(complexRealError);
      expect(result.errorCode).toBe(300);
      expect(result.userFriendlyMessage).toContain(
        "price difference is too high"
      );
      expect(result.contractType).toBe("pair");
      expect(result.technicalDetails).toBe(complexRealError);
    });
  });
});

// Example usage demonstrations
console.log("=== Enhanced Error Resolver Examples ===");

// Example 1: Standard contract error
const error1 = resolveContractErrorEnhanced("Error(Contract, #300)");
console.log("Example 1 - Standard error:");
console.log("User message:", error1.userFriendlyMessage);
console.log("Error code:", error1.errorCode);
console.log("Technical:", error1.technicalDetails);
console.log("");

// Example 2: Complex transaction error
const error2 = resolveContractErrorEnhanced(
  "Transaction simulation failed: HostError: Error(Contract, #101)"
);
console.log("Example 2 - Transaction simulation error:");
console.log("User message:", error2.userFriendlyMessage);
console.log("Error code:", error2.errorCode);
console.log("Technical:", error2.technicalDetails);
console.log("");

// Example 3: Unknown error
const error3 = resolveContractErrorEnhanced("Network connection failed");
console.log("Example 3 - Unknown error:");
console.log("User message:", error3.userFriendlyMessage);
console.log("Error code:", error3.errorCode);
console.log("Technical:", error3.technicalDetails);
