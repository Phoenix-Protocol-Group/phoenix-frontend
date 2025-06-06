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

      const wc = await new WalletConnect({
        projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
        name: "Phoenix DeFi Hub",
        description: "Serving only the tastiest DeFi",
        url: "https://app.phoenix-hub.io",
        icons: ["https://app.phoenix-hub.io/logoIcon.png"],
        method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT, // Use the correct WalletConnectAllowedMethods value
        network: "pubnet",
      });

      const sessions = await wc.getSessions();

      if (!sessions.length) {
        persistStore.disconnectWallet();
        return;
      }

      const session = sessions[0];
      const now = Math.floor(Date.now() / 1000);

      useAppStore.setState((state) => ({
        ...state,
        walletConnectInstance: wc,
      }));
      wc.setSession(session.id);
      console.log("WalletConnect session restored:", session);
    };

    restoreSession();
  }, [persistStore.wallet.walletType]);
};
