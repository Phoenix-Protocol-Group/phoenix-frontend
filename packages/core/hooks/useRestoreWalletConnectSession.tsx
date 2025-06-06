import { useEffect } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { usePersistStore } from "@phoenix-protocol/state";

export const useRestoreWalletConnectSession = () => {
  const persistStore = usePersistStore();

  useEffect(() => {
    const checkSession = async () => {
      if (persistStore.wallet.walletType !== "wallet-connect") return;

      const client = await SignClient.init({
        projectId: "YOUR_PROJECT_ID", // same one used in your modal
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "Phoenix",
          description: "Phoenix DeFi Hub",
          url: "https://app.phoenix-hub.io",
          icons: ["https://app.phoenix-hub.io/icon.png"],
        },
      });

      const sessions = client.session.getAll();

      if (sessions.length === 0) {
        // No active session: clean up
        persistStore.disconnectWallet();
        console.log("No active WalletConnect session found.");
        return;
      }

      const session = sessions[0]; // You might support multiple sessions later

      const now = Math.floor(Date.now() / 1000);
      if (session.expiry <= now) {
        // Session expired: disconnect and clear
        await client.disconnect({
          topic: session.topic,
          reason: {
            code: 6000,
            message: "Session expired",
          },
        });

        persistStore.disconnectWallet();
        console.log("WalletConnect session has expired. Disconnected.");
        return;
      }

      // Session is still valid
      console.log("WalletConnect session is still active:", session);
    };

    checkSession();
  }, [persistStore.wallet.walletType]);
};
