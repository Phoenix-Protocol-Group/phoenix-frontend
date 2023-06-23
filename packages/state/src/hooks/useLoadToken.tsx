import * as SorobanClient from "soroban-client";
import { useContractQuery } from "./contracts";
import { SorobanContextType } from "../providers/walletProvider/soroban";

export const useLoadToken = (
  contractId: string,
  address: string,
  sorobanContext: SorobanContextType
): any => {
  return {
    decimals: useContractQuery({
      contractId,
      method: "decimals",
      sorobanContext,
    }),

    name: useContractQuery({
      contractId,
      method: "name",
      sorobanContext,
    }),

    symbol: useContractQuery({
      contractId,
      method: "symbol",
      sorobanContext,
    }),
  };
};
