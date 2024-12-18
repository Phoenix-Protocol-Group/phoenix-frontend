import freighter from "@stellar/freighter-api";
import { Account } from "@stellar/stellar-sdk";
import { Server } from "./server";
// working around ESM compatibility issues
const { isConnected, isAllowed, getAddress } = freighter;

/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, return null.
 */
export async function getAccount(): Promise<Account | null> {
  if (!(await isConnected()) || !(await isAllowed())) {
    return null;
  }

  const publicKey = await getAddress();
  if (publicKey.error) {
    return null;
  }

  try {
    const account = new Account(
      publicKey.address,
      (await Server.accounts().accountId(publicKey.address).call()).sequence
    );
    return account || null;
  } catch (e) {
    return null;
  }
}
