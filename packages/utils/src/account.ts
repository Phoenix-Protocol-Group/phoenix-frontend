import freighter from "@stellar/freighter-api";
import { Account } from "soroban-client";
import { Server } from "./server";
// working around ESM compatibility issues
const { isConnected, isAllowed, getUserInfo, signTransaction } = freighter;

/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, return null.
 */
export async function getAccount(): Promise<Account | null> {
  if (!(await isConnected()) || !(await isAllowed())) {
    return null;
  }

  const { publicKey } = await getUserInfo();
  if (!publicKey) {
    return null;
  }
  try {
    return await Server.getAccount(publicKey);
  } catch (e) {
    return null;
  }
}
