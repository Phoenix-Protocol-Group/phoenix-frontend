import {
  AppStore,
  GetStateType,
  SetStateType,
  StateToken,
  WalletActions,
  Token,
} from "@phoenix-protocol/types";
import {
  fetchPho,
  PhoenixFactoryContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { usePersistStore } from "../store";
import {
  constants,
  fetchTokenPrices,
  Signer,
  TradeAPi,
} from "@phoenix-protocol/utils";
import { LiquidityPoolInfo } from "@phoenix-protocol/contracts/build/phoenix-pair";

const getCategory = (name: string) => {
  switch (name.toLowerCase()) {
    case "usdc":
    case "usdx":
    case "eurc":
    case "veur":
    case "vchf":
    case "eurx":
    case "gbpx":
      return "Stable";

    default:
      return "Non-Stable";
  }
};

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    tokens: [],

    getAllTokens: async () => {
      // If wallet is connected, use it, otherwise some demo account
      const appStorageValue = localStorage?.getItem("app-storage");

      let address: string = "";

      if (appStorageValue !== null) {
        try {
          const parsedValue = JSON.parse(appStorageValue);
          address = parsedValue?.state?.wallet?.address;
        } catch (error) {
          console.log("Error parsing app-storage value:", error);
        }
      }
      let parsedResults: LiquidityPoolInfo[];
      try {
        const publicKey = address || constants.TESTING_SOURCE.accountId();

        // Factory contract
        const factoryContract = new PhoenixFactoryContract.Client({
          publicKey,
          contractId: constants.FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
          signTransaction: (tx: string) => new Signer().sign(tx),
        });
        // Fetch all available tokens from chain
        const allPoolsDetails = await factoryContract.query_all_pools_details({
          simulate: false,
        });
        const _allPoolsDetails = await allPoolsDetails.simulate({
          restore: true,
        });

        // Parse results
        parsedResults = allPoolsDetails.result;
      } catch (e) {
        const publicKey = constants.TESTING_SOURCE.accountId();

        // Factory contract
        const factoryContract = new PhoenixFactoryContract.Client({
          publicKey,
          contractId: constants.FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });
        // Fetch all available tokens from chain
        const allPoolsDetails = await factoryContract.query_all_pools_details();

        // Parse results
        parsedResults = allPoolsDetails.result;
      }

      // Loop through all pools and get asset_a and asset_b addresses in an array
      const _allAssets = parsedResults
        .map((pool) => [
          pool.pool_response.asset_a.address,
          pool.pool_response.asset_b.address,
        ])
        // Flatten the array
        .reduce((acc: string[], curr: string[]) => [...acc, ...curr], [])
        // Remove duplicates
        .filter((address, index, self) => self.indexOf(address) === index);

      // Fetch all tokens with enriched data
      const allTokensPromises = _allAssets.map(async (asset) => {
        return await getState().fetchTokenInfo(asset);
      });

      const allTokensResults = await Promise.all(allTokensPromises);
      // Filter out any undefined results and process the valid tokens
      const validTokens = allTokensResults.filter((token): token is Token => 
        token !== undefined &&
        token.symbol !== "POOL" &&
        token.symbol !== "PUST" &&
        token.symbol !== "EXUT" &&
        token.symbol !== "XEXT" &&
        token.symbol !== "XGXT" &&
        token.symbol !== "GXUT" &&
        !token.isStakingToken
      );

      setState((state: AppStore) => {
        return { tokens: validTokens };
      });
      return validTokens;
    },

    fetchTokenInfo: async (
      tokenAddress: string,
      isStakingToken: boolean = false
    ) => {
      // Check if account, server, and network passphrase are set
      if (!getState().server || !getState().networkPassphrase) {
        throw new Error("Missing account, server, or network passphrase");
      }

      // Check if token already exists and return/update it
      const existingToken = getState().tokens.find((token: Token) => 
        token.contractId === tokenAddress || token.id === tokenAddress
      );

      // Token contract
      const TokenContract = new SorobanTokenContract.Client({
        contractId: tokenAddress.toString(),
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      let balance: bigint;
      try {
        balance = (
          await TokenContract.balance({
            id: usePersistStore.getState().wallet.address!,
          })
        ).result;

        if (
          tokenAddress ==
          "CABCLZXGTOIZ75FFKDGVANUT665LO34DZM5LHHDNVEHDFTC5CY4UTIWQ"
        ) {
          const additionalToken = await getState().fetchTokenInfo(
            "CBSM6C6OZJN2CS27RFTTYZJNAGRZ4MFHWVSV6GKLMCOYTQXD6K7UEA2A"
          );
          balance += additionalToken?.balance || BigInt(0);
        }
      } catch (e) {
        balance = BigInt(0);
      }

      let symbol: string;
      try {
        symbol = existingToken?.symbol || (await TokenContract.symbol()).result;
        symbol = symbol === "native" ? "XLM" : symbol;
      } catch (e) {
        return;
      }

      const decimals = existingToken?.decimals || Number((await TokenContract.decimals()).result);

      // Get price data
      const tradeAPI = new TradeAPi.API(constants.TRADING_API_URL);
      let usdValue: number;
      try {
        usdValue = Number(
          symbol === "PHO"
            ? await fetchPho()
            : await tradeAPI.getPrice(tokenAddress)
        );
      } catch (e) {
        usdValue = 0;
      }

      // Create the normalized token object
      const tokenData: Token = {
        name: symbol,
        symbol: symbol,
        icon: `/cryptoIcons/${symbol.toLowerCase()}.svg`,
        amount: Number(balance) / (10 ** decimals),
        category: getCategory(symbol),
        usdValue: usdValue,
        contractId: tokenAddress,
        id: tokenAddress, // For backward compatibility
        decimals: decimals,
        balance: balance,
        isStakingToken: isStakingToken,
      };

      // Update token in the array
      setState((state: AppStore) => {
        const updatedTokens = state.tokens.map((token: Token) =>
          token.contractId === tokenAddress || token.id === tokenAddress
            ? { ...token, ...tokenData }
            : token
        );
        
        // If token couldn't be found, add it
        if (!updatedTokens.find((token: Token) => 
          token.contractId === tokenAddress || token.id === tokenAddress
        )) {
          updatedTokens.push(tokenData);
        }
        
        return { tokens: updatedTokens };
      });

      return tokenData;
    },
  };
};
