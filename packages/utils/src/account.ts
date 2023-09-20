import { Account } from "soroban-client";
import { Server } from "./server";
import {
  Connector,
  usePersistStore,
  freighter
} from "@phoenix-protocol/state";

export function getConnector(): Connector | undefined {
  const storePersist = usePersistStore.getState();

  switch (storePersist.wallet.connector) {
    case "freighter": 
     return freighter();
    default:
      return undefined;
  }
}

/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, return null.
 */
export async function getAccount(): Promise<Account | null> {
  const connector = getConnector();

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
