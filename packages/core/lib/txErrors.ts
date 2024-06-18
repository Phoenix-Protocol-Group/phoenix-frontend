import { PersistWalletActions } from "@phoenix-protocol/types";

export function handleXDRIssues(
  error: Error,
  setSuccessModalOpen: (isOpen: boolean) => void,
  setLoading: (isLoading: boolean) => void,
  setErrorModalOpen: (isOpen: boolean) => void,
  storePersist: PersistWalletActions,
  setErrorDescription: (description: string) => void,
  resolveContractError: (error: string) => string,
  setTokenAmounts?: (amounts: [number, number] | [number]) => void,
  tokenAAmount?: number,
  tokenBAmount?: number,
  refresh?: () => void
): void {
  if (error.message.includes("envelope")) {
    if (
      tokenAAmount !== undefined &&
      tokenBAmount !== undefined &&
      setTokenAmounts !== undefined
    ) {
      setTokenAmounts([tokenAAmount, tokenBAmount]);
    } else if (tokenAAmount !== undefined && setTokenAmounts !== undefined) {
      setTokenAmounts([tokenAAmount]);
    }
    setSuccessModalOpen(true);
    setLoading(false);
    // Wait 7 Seconds for the next block and fetch new balances
    setTimeout(() => {
      if (refresh) {
        refresh();
      }
    }, 7000);
    return;
  }

  setErrorModalOpen(true);

  if (storePersist.wallet.walletType === "wallet-connect") {
    if (error.message.includes("simulation failed")) {
      setErrorDescription(resolveContractError(JSON.stringify(error.message)));
    } else {
      setErrorDescription(error.message);
    }
  } else {
    setErrorDescription(resolveContractError(JSON.stringify(error.message)));
  }

  setLoading(false);
  console.error(error);
}
