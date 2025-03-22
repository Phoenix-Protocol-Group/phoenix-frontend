/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// React-related imports
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type JSX,
} from "react";
import { useDebounce } from "use-debounce";
import { motion } from "framer-motion";

// TX Hook
import { useContractTransaction } from "@/hooks/useContractTransaction";

// Component and utility imports
import {
  AssetSelector,
  Skeleton,
  SlippageSettings,
  SwapContainer,
} from "@phoenix-protocol/ui";
import { Token } from "@phoenix-protocol/types";
import {
  PhoenixFactoryContract,
  PhoenixMultihopContract,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  checkTrustline,
  constants,
  fetchAndIssueTrustline,
  fetchTokenPrices,
  findBestPath,
  resolveContractError,
  Signer,
  WalletConnect,
} from "@phoenix-protocol/utils";
import { LoadingSwap, SwapError, SwapSuccess } from "@/components/Modal/Modal";
import { Box } from "@mui/material";

/**
 * SwapPage Component
 * Handles token swapping functionality, with support for slippage settings,
 * asset selection, swap simulation, and trustline management.
 *
 * @component
 */
export default function SwapPage(): JSX.Element {
  // State variables declaration and initialization
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState<boolean>(false);
  const [isFrom, setIsFrom] = useState<boolean>(true);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<string>("");
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0, 0]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | undefined>(undefined);
  const [toToken, setToToken] = useState<Token | undefined>(undefined);
  const [maxSpread, setMaxSpread] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapRoute, setSwapRoute] = useState<string>("");
  const [operations, setOperations] = useState<any[]>([]);
  const [txBroadcasting, setTxBroadcasting] = useState<boolean>(false);
  const [loadingSimulate, setLoadingSimulate] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [networkFee, setNetworkFee] = useState<string>("");
  const [trustlineButtonActive, setTrustlineButtonActive] =
    useState<boolean>(false);
  const [trustlineTokenName, setTrustlineTokenName] = useState<string>("");
  const [trustlineTokenSymbol, setTrustlineTokenSymbol] = useState<string>("");

  const [trustlineAssetAmount, setTrustlineAssetAmount] = useState<number>(0);
  const [allPools, setAllPools] = useState<any[]>([]);

  // Using the store
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  const [fromAmount] = useDebounce<number>(tokenAmounts[0], 500);

  const { executeContractTransaction } = useContractTransaction();

  /**
   * Executes the swap transaction.
   * This function signs and sends the transaction using WalletConnect or Signer.
   *
   * @async
   */
  const doSwap = useCallback(async (): Promise<void> => {
    try {
      // Execute the transaction using the hook
      await executeContractTransaction({
        contractType: "multihop",
        contractAddress: constants.MULTIHOP_ADDRESS,
        transactionFunction: async (client, restore) => {
          return client.swap(
            {
              recipient: storePersist.wallet.address!,
              operations,
              amount: BigInt(tokenAmounts[0] * 10 ** 7),
              max_spread_bps: BigInt(maxSpread * 100),
              deadline: undefined,
              pool_type: 0,
              max_allowed_fee_bps: undefined,
            },
            { simulate: !restore }
          );
        },
      });

      // Wait for the next block and fetch token balances
      setTimeout(async () => {
        await appStore.fetchTokenInfo(fromToken?.name!);
        await appStore.fetchTokenInfo(toToken?.name!);
      }, 7000);
    } catch (error) {
      console.log("Error during swap transaction", error);
    }
  }, [
    appStore,
    fromToken?.name,
    maxSpread,
    operations,
    storePersist,
    toToken?.name,
    tokenAmounts,
    executeContractTransaction,
  ]);

  /**
   * Simulates the swap transaction to determine the exchange rate and network fee.
   *
   * @async
   */
  const doSimulateSwap = useCallback(async (): Promise<void> => {
    if (fromToken && toToken) {
      if (tokenAmounts[0] === 0) {
        setTokenAmounts([0, 0]);
        setExchangeRate("");
        setNetworkFee("");
        return;
      }

      setLoadingSimulate(true);
      try {
        const contract = new PhoenixMultihopContract.Client({
          contractId: constants.MULTIHOP_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const tx = await contract.simulate_swap({
          operations,
          amount: BigInt(tokenAmounts[0] * 10 ** 7),
          pool_type: 0,
        });

        if (tx.result.ask_amount && tx.result.commission_amounts) {
          const _exchangeRate =
            (Number(tx.result.ask_amount) -
              Number(tx.result.commission_amounts[0][1])) /
            Number(tokenAmounts[0]);

          setExchangeRate(
            `${(_exchangeRate / 10 ** 7).toFixed(2)} ${toToken?.name} per ${
              fromToken?.name
            }`
          );
          setNetworkFee(
            `${Number(tx.result.commission_amounts[0][1]) / 10 ** 7} ${
              fromToken?.name
            }`
          );

          setTokenAmounts((prevAmounts) => {
            const newToTokenAmount = Number(tx.result.ask_amount) / 10 ** 7;
            return [prevAmounts[0], newToTokenAmount];
          });
        }
      } catch (e) {
        console.log(e);
      }
      setLoadingSimulate(false);
    }
  }, [fromToken?.name, toToken, fromAmount, operations, tokenAmounts]);

  /**
   * Handles user selecting a token from the asset selector.
   *
   * @param {Token} token - The token selected by the user.
   */
  const handleTokenClick = useCallback(
    (token: Token): void => {
      if (isFrom) {
        setTokens(
          (tokens) =>
            [
              ...tokens.filter((el) => el.name !== token.name),
              fromToken,
            ].filter(Boolean) as Token[]
        );
        setFromToken(token);
      } else {
        setTokens(
          (tokens) =>
            [...tokens.filter((el) => el.name !== token.name), toToken].filter(
              Boolean
            ) as Token[]
        );
        setToToken(token);
      }
      setAssetSelectorOpen(false);
    },
    [fromToken, isFrom, toToken]
  );

  /**
   * Opens the asset selector.
   *
   * @param {boolean} isFromToken - Whether the asset selector is for the "from" token.
   */
  const handleSelectorOpen = useCallback((isFromToken: boolean): void => {
    setAssetSelectorOpen(true);
    setIsFrom(isFromToken);
  }, []);

  // Effect hook to fetch all tokens once the component mounts
  useEffect(() => {
    const getAllTokens = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const allTokens = await appStore.getAllTokens();
        setTokens(allTokens.slice(2));
        setFromToken(allTokens[0]);
        setToToken(allTokens[1]);
        setIsLoading(false);

        // Get all pools
        const factoryContract = new PhoenixFactoryContract.Client({
          contractId: constants.FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });
        const { result } = await factoryContract.query_all_pools_details();

        const allPairs = result.map((pool: any) => ({
          asset_a: pool.pool_response.asset_a.address,
          asset_b: pool.pool_response.asset_b.address,
        }));
        setAllPools(allPairs);
      } catch (e) {
        console.error(e);
      } finally {
        appStore.setLoading(false);
      }
    };
    getAllTokens();
  }, []);

  // Effect hook to simulate swaps on token change
  useEffect(() => {
    if (fromToken && toToken && operations.length > 0) {
      doSimulateSwap();
    }
  }, [fromToken, toToken, fromAmount, operations.length]);

  // Effect hook to update operations when tokens change
  useEffect(() => {
    if (fromToken && toToken) {
      const fromTokenContractID = appStore.allTokens.find(
        (token: Token) => token.name === fromToken.name
      )?.contractId;
      const toTokenContractID = appStore.allTokens.find(
        (token: Token) => token.name === toToken.name
      )?.contractId;

      if (!fromTokenContractID || !toTokenContractID) return;

      const { operations: ops } = findBestPath(
        toTokenContractID,
        fromTokenContractID,
        allPools
      );
      const _operations = ops.reverse();
      const _swapRoute = _operations
        .map(
          (op) =>
            appStore.allTokens.find(
              (token: any) => token.contractId === op.ask_asset
            )?.name
        )
        .filter(Boolean);

      setOperations((prevOps) =>
        prevOps !== _operations ? _operations : prevOps
      );
      setSwapRoute(`${fromToken.name} -> ${_swapRoute.join(" -> ")}`);
      if (storePersist.wallet.address) {
        handleTrustLine(toTokenContractID);
      }
    }
  }, [allPools, fromToken?.name, toToken?.name, storePersist.wallet.address]);

  /**
   * Handles adding a trustline for a token.
   *
   * @param {string} tokenAddress - The address of the token.
   * @async
   */
  const handleTrustLine = useCallback(
    async (tokenAddress: string): Promise<void> => {
      const trust = await checkTrustline(
        storePersist.wallet.address!,
        tokenAddress
      );
      setTrustlineButtonActive(!trust.exists);
      setTrustlineTokenSymbol(trust.asset?.code || "");
      const tlAsset = await appStore.fetchTokenInfo(
        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
      );
      setTrustlineAssetAmount(
        Number(tlAsset?.balance) / 10 ** tlAsset?.decimals!
      );
      setTrustlineTokenName(trust.asset?.contract || "");
    },
    [storePersist.wallet.address]
  );

  /**
   * Adds a trustline for the specified token.
   *
   * @async
   */
  const addTrustLine = useCallback(async (): Promise<void> => {
    try {
      setTxBroadcasting(true);
      await fetchAndIssueTrustline(
        storePersist.wallet.address!,
        trustlineTokenName
      );
      setTrustlineButtonActive(false);
    } catch (e) {
      console.log(e);
    }
    setTxBroadcasting(false);
  }, [storePersist.wallet.address, trustlineTokenName]);

  return (
    <>
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Swap your tokens" />

      {isLoading ? (
        <Box sx={{ width: "100%", maxWidth: "1440px", mt: 12 }}>
          <Skeleton.Swap />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: "1440px",
            mt: 12,
            background: "linear-gradient(to bottom, #151719, #0A0B0C)",
          }}
        >
          <Box>
            {!optionsOpen && !assetSelectorOpen && fromToken && toToken && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SwapContainer
                  onOptionsClick={() => setOptionsOpen(true)}
                  onSwapTokensClick={() => {
                    setTokenAmounts((prevAmounts) => [
                      prevAmounts[1],
                      prevAmounts[0],
                    ]);
                    setFromToken(toToken);
                    setToToken(fromToken);
                  }}
                  fromTokenValue={tokenAmounts[0].toString()}
                  toTokenValue={tokenAmounts[1].toString()}
                  fromToken={fromToken}
                  toToken={toToken}
                  onTokenSelectorClick={(isFromToken: boolean) =>
                    handleSelectorOpen(isFromToken)
                  }
                  onSwapButtonClick={() => doSwap()}
                  onInputChange={(isFrom: boolean, value: string) => {
                    setTokenAmounts((prevAmounts) =>
                      isFrom
                        ? [Number(value), 0]
                        : [prevAmounts[0], Number(value)]
                    );
                  }}
                  exchangeRate={exchangeRate}
                  networkFee={networkFee}
                  route={swapRoute}
                  loadingSimulate={loadingSimulate}
                  estSellPrice={"TODO"}
                  minSellPrice={"TODO"}
                  slippageTolerance={`${maxSpread}%`}
                  swapButtonDisabled={
                    tokenAmounts[0] <= 0 ||
                    storePersist.wallet.address === undefined
                  }
                  trustlineButtonActive={trustlineButtonActive}
                  trustlineAssetName={trustlineTokenSymbol}
                  trustlineButtonDisabled={trustlineAssetAmount < 0.5}
                  onTrustlineButtonClick={() => addTrustLine()}
                />
              </motion.div>
            )}
            {optionsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SlippageSettings
                  options={["1%", "3%", "5%"]}
                  selectedOption={maxSpread}
                  onClose={() => setOptionsOpen(false)}
                  onChange={(option: string) => setMaxSpread(Number(option))}
                />
              </motion.div>
            )}
            {assetSelectorOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {tokens.length > 0 ? (
                  <AssetSelector
                    tokens={tokens}
                    tokensAll={tokens}
                    onClose={() => setAssetSelectorOpen(false)}
                    onTokenClick={handleTokenClick}
                  />
                ) : (
                  <Skeleton.AssetSelector
                    onClose={() => setAssetSelectorOpen(false)}
                  />
                )}
              </motion.div>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
