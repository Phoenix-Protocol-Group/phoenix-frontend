import { useEffect } from "react";
import { usePersistStore, useAppStore } from "@phoenix-protocol/state";
import { WalletConnect } from "@phoenix-protocol/utils";
import { WalletConnectAllowedMethods } from "@phoenix-protocol/utils/build/wallets/wallet-connect";

export const useRestoreWalletConnectSession = () => {
  const persistStore = usePersistStore();
  const appStore = useAppStore();

  useEffect(() => {
    const restoreSession = async () => {
      if (persistStore.wallet.walletType !== "wallet-connect") return;

      try {
        const wc = new WalletConnect({
          projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
          name: "Phoenix DeFi Hub",
          description: "Serving only the tastiest DeFi",
          url: "https://app.phoenix-hub.io",
          icons: ["https://app.phoenix-hub.io/logoIcon.png"],
          method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
          network: "pubnet",
        });

        // Wait for client to initialize
        await wc.initializingClient;

        // Check if we have any valid sessions
        const hasValidSession = await wc.hasValidSession();

        if (!hasValidSession) {
          console.log(
            "No valid WalletConnect sessions found, disconnecting wallet"
          );
          persistStore.disconnectWallet();
          return;
        }

        const sessions = await wc.getSessions();
        if (sessions.length > 0) {
          const session = sessions[0];
          const restored = await wc.restoreSession(session.id);

          if (restored) {
            useAppStore.setState((state) => ({
              ...state,
              walletConnectInstance: wc,
            }));

            console.log("WalletConnect session restored:", session);
          } else {
            console.log(
              "Failed to restore WalletConnect session, disconnecting"
            );
            persistStore.disconnectWallet();
          }
        }
      } catch (error) {
        console.error("Error restoring WalletConnect session:", error);
        persistStore.disconnectWallet();
      }
    };

    restoreSession();
  }, [persistStore.wallet.walletType]);
};
