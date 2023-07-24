import { Contract } from "soroban-client";

/**
 * The Soroban contract ID for the phoenix-pair contract, in hex.
 * If {@link CONTRACT_ID} is a new-style `C…` string, you will need this hex
 * version when making calls to RPC for now.
 */
export const getContractIdHex = (CONTRACT_ID: string) =>
  new Contract(CONTRACT_ID).contractId("hex");
