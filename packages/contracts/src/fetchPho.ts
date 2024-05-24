import { constants } from "@phoenix-protocol/utils";
import { PhoenixPairContract } from ".";

export const fetchPho = async (): Promise<number> => {
  const PairContract = new PhoenixPairContract.Client({
    contractId: "CAZ6W4WHVGQBGURYTUOLCUOOHW6VQGAAPSPCD72VEDZMBBPY7H43AYEC",
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const [pairInfo] = await Promise.all([PairContract.query_pool_info()]);

  const usdcAmount = Number(pairInfo.result.asset_b.amount);
  const phoAmount = Number(pairInfo.result.asset_a.amount);

  return Number(usdcAmount / phoAmount);
};
