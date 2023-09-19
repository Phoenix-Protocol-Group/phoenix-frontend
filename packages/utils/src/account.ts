import { Account } from "soroban-client";
import { Server } from "./server";
import {
  usePersistStore,
} from "@phoenix-protocol/state";

/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, return null.
 */
export async function getAccount(): Promise<Account | null> {
  const storePersist = usePersistStore.getState();
  const connector = storePersist.wallet.connector;

  if(!connector) return null;

  if (!(await connector.isConnected()) || !(await connector.isAllowed())) {
    return null;
  }

  const { publicKey } = await connector.getUserInfo();
  if (!publicKey) {
    return null;
  }
  try {
    return await Server.getAccount(publicKey);
  } catch (e) {
    return null;
  }
}
