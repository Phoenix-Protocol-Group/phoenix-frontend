import { constants } from "@phoenix-protocol/utils";
import { PhoenixPairContract } from ".";

export const fetchPho = async (): Promise<number> => {
  // If wallet is connected, use it, otherwise some demo account
  const appStorageValue = localStorage?.getItem("app-storage");

  let address: string = "";

  if (appStorageValue !== null) {
    try {
      const parsedValue = JSON.parse(appStorageValue);
      address = parsedValue?.state?.wallet?.address;
    } catch (error) {
      console.error("Error parsing app-storage value:", error);
    }
  }

  const publicKey = address || constants.TESTING_SOURCE.accountId();
  const PairContract = new PhoenixPairContract.Client({
    publicKey,
    contractId: "CAZ6W4WHVGQBGURYTUOLCUOOHW6VQGAAPSPCD72VEDZMBBPY7H43AYEC",
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const [pairInfo] = await Promise.all([PairContract.query_pool_info()]);

  const usdcAmount = Number(pairInfo.result.asset_b.amount);
  const phoAmount = Number(pairInfo.result.asset_a.amount);

  return Number(usdcAmount / phoAmount);
};
