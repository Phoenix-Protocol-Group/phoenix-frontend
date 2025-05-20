import { constants } from "@phoenix-protocol/utils";
import { PhoenixPairContract } from ".";
import { isTestnet } from "@phoenix-protocol/utils/build/constants";

export const fetchPho = async (): Promise<number> => {
  if (isTestnet) {
    return 0;
  }

  const PairContract = new PhoenixPairContract.Client({
    contractId: "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA",
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const [pairInfo] = await Promise.all([PairContract.query_pool_info()]);

  const usdcAmount = Number(pairInfo.result.asset_b.amount);
  const phoAmount = Number(pairInfo.result.asset_a.amount);

  return Number(usdcAmount / phoAmount);
};
