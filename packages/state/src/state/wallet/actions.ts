import {
  WalletActions,
  StateToken as Token,
  AppStore,
  SetStateType,
  GetStateType,
} from "@phoenix-protocol/types";
import {
  PhoenixFactoryContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { usePersistStore } from "../store";
import { constants, fetchTokenPrices } from "@phoenix-protocol/utils";
import { Address } from "stellar-sdk";

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    tokens: [],
    allTokens: [],

    getAllTokens: async () => {
      // Factory contract
      const factoryContract = new PhoenixFactoryContract.Contract({
        contractId: constants.FACTORY_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      // Fetch all available tokens from chain
      const allPoolsDetails = await factoryContract.queryAllPoolsDetails();

      // Loop through all pools and get asset_a and asset_b addresses in an array
      const _allAssets = allPoolsDetails.result
        .map((pool) => [
          pool.pool_response.asset_a.address.toString(),
          pool.pool_response.asset_b.address.toString(),
        ])
        // Flatten the array
        .reduce((acc: string[], curr: string[]) => [...acc, ...curr], [])
        // Remove duplicates
        .filter((address, index, self) => self.indexOf(address) === index);

      const allAssets = _allAssets
        ? _allAssets.map(async (asset) => {
            await getState().fetchTokenInfo(Address.fromString(asset));
          })
        : [];

      await Promise.all(allAssets);

      const _tokens = getState()
        .tokens.filter(
          (token: Token) =>
            token?.symbol !== "POOL" && token.isStakingToken !== true
        )
        .map(async (token: Token) => {
          return {
            name: token?.symbol === "native" ? "XLM" : token?.symbol,
            icon: `/cryptoIcons/${
              token?.symbol === "native" ? "XLM" : token?.symbol.toLowerCase()
            }.svg`,
            amount: Number(token?.balance) / 10 ** token?.decimals,
            category: "Non-Stable", // todo: add category
            usdValue: (
              (Number(token?.balance) / 10 ** token?.decimals) *
              (await fetchTokenPrices(token?.symbol))
            ).toFixed(2), // todo: add usdValue
            contractId: token?.id,
          };
        });
      // Wait promise
      const _allTokens = await Promise.all(_tokens);
      setState((state: AppStore) => {
        return { allTokens: _allTokens };
      });
      return _allTokens;
    },

    fetchTokenInfo: async (
      tokenAddress: Address,
      isStakingToken: boolean = false
    ) => {
      let updatedTokenInfo: Token | undefined;
      // Check if account, server, and network passphrase are set
      if (!getState().server || !getState().networkPassphrase) {
        throw new Error("Missing account, server, or network passphrase");
      }

      const TokenContract = new SorobanTokenContract.Contract({
        contractId: tokenAddress.toString(),
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      let balance: bigint;
      try {
        balance = BigInt(
          (
            await TokenContract.balance({
              id: usePersistStore.getState().wallet.address!,
            })
          ).result
        );
      } catch (e) {
        balance = BigInt(0);
      }
      let symbol: string;
      try {
        const _symbol: string =
          getState().tokens.find(
            (token: Token) => token.id === tokenAddress.toString()
          )?.symbol || (await TokenContract.symbol()).result;
        symbol = _symbol === "native" ? "XLM" : _symbol;
      } catch (e) {
        return;
      }
      const decimals =
        getState().tokens.find(
          (token: Token) => token.id === tokenAddress.toString()
        )?.decimals || Number((await TokenContract.decimals()).result);

      // Update token balance
      setState((state: AppStore) => {
        const updatedTokens = state.tokens.map((token: Token) =>
          token.id === tokenAddress.toString()
            ? { ...token, balance, decimals, symbol, isStakingToken }
            : token
        );
        // If token couldnt be found, add it
        if (
          !updatedTokens.find(
            (token: Token) => token.id === tokenAddress.toString()
          )
        ) {
          updatedTokens.push({
            id: tokenAddress.toString(),
            balance,
            decimals: decimals,
            symbol: symbol === "native" ? "XLM" : symbol,
            isStakingToken,
          });
        }
        updatedTokenInfo = updatedTokens.find(
          (token: Token) => token.id === tokenAddress.toString()
        );
        return { tokens: updatedTokens };
      });
      return updatedTokenInfo;
    },
  };
};
