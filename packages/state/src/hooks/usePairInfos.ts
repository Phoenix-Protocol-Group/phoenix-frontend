import * as SorobanClient from "soroban-client";
import { useContractQuery } from "./contracts";
import { SorobanContextType } from "../providers/walletProvider/soroban";

export const usePairInfos = (
  contractId: string,
  sorobanContext: SorobanContextType
): any => {
  return {
    infos: useContractQuery({
      contractId,
      method: "query_pool_info",
      sorobanContext,
    }),
  };
};
