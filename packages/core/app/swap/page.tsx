/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// React-related imports
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
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
import ClientOnly from "@/providers/ClientOnlyProvider";

/**
 * SwapPage Component
 * Handles token swapping functionality, with support for slippage settings,
 * asset selection, swap simulation, and trustline management.
 *
 * @component
 */
export default function SwapPage(): JSX.Element {
  // State for client-side rendering detection
  const [isClient, setIsClient] = useState(false);

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

  // Flags to prevent multiple initializations and rerenders
  const initialSetupComplete = useRef(false);
  const operationsUpdateComplete = useRef(false);
  const hasTokensLoaded = useRef(false);
  const hasPoolsLoaded = useRef(false);
  const prevOperations = useRef<string>("");
  const simulationRequestRef = useRef<NodeJS.Timeout | null>(null);
  const tokenLoadCount = useRef(0);

  const [fromAmount] = useDebounce<number>(tokenAmounts[0], 500);

  const { executeContractTransaction } = useContractTransaction();

  // Mark component as client-side rendered on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Fetches token balances after a transaction completes
   */
  const refreshTokenBalances = useCallback(async () => {
    if (fromToken?.name) {
      await appStore.fetchTokenInfo(fromToken.name);
    }
    if (toToken?.name) {
      await appStore.fetchTokenInfo(toToken.name);
    }
  }, [appStore, fromToken?.name, toToken?.name]);

  /**
   * Handles adding a trustline for a token.
   */
  const handleTrustLine = useCallback(
    async (tokenAddress: string): Promise<void> => {
      if (!storePersist.wallet.address || !tokenAddress) return;

      try {
        const trust = await checkTrustline(
          storePersist.wallet.address,
          tokenAddress
        );

        setTrustlineButtonActive(!trust.exists);
        setTrustlineTokenSymbol(trust.asset?.code || "");

        // Only fetch trustline asset if needed
        if (!trust.exists) {
          const tlAsset = await appStore.fetchTokenInfo(
            "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
          );
          if (tlAsset?.decimals) {
            setTrustlineAssetAmount(
              Number(tlAsset.balance) / 10 ** tlAsset.decimals
            );
          }
        }

        setTrustlineTokenName(trust.asset?.contract || "");
      } catch (error) {
        console.error("Error checking trustline:", error);
      }
    },
    [storePersist.wallet.address, appStore]
  );

  /**
   * Adds a trustline for the specified token.
   */
  const addTrustLine = useCallback(async (): Promise<void> => {
    if (!storePersist.wallet.address || !trustlineTokenName) return;

    try {
      setTxBroadcasting(true);
      await fetchAndIssueTrustline(
        storePersist.wallet.address,
        trustlineTokenName
      );
      setTrustlineButtonActive(false);

      // Refresh token balances after creating trustline
      setTimeout(refreshTokenBalances, 7000);
    } catch (e) {
      console.log("Error creating trustline:", e);
    } finally {
      setTxBroadcasting(false);
    }
  }, [storePersist.wallet.address, trustlineTokenName, refreshTokenBalances]);

  /**
   * Executes the swap transaction.
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
        options: {
          onSuccess: () => {
            setTimeout(refreshTokenBalances, 7000);
          },
        },
      });
    } catch (error) {
      console.log("Error during swap transaction", error);
    }
  }, [
    maxSpread,
    operations,
    storePersist.wallet.address,
    tokenAmounts,
    executeContractTransaction,
    refreshTokenBalances,
  ]);

  /**
   * Simulates the swap transaction with throttling to prevent excessive API calls
   */
  const doSimulateSwap = useCallback(async (): Promise<void> => {
    // Clear any pending simulation requests
    if (simulationRequestRef.current) {
      clearTimeout(simulationRequestRef.current);
      simulationRequestRef.current = null;
    }

    // Guard clauses to prevent unnecessary simulation
    if (!fromToken || !toToken || !operations.length || tokenAmounts[0] === 0) {
      setTokenAmounts((prevAmounts) => [prevAmounts[0], 0]);
      setExchangeRate("");
      setNetworkFee("");
      return;
    }

    // Prevent simulation if already simulating
    if (loadingSimulate) return;

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

        // Only update if the amount has actually changed
        const newToTokenAmount = Number(tx.result.ask_amount) / 10 ** 7;
        setTokenAmounts((prevAmounts) => {
          if (Math.abs(prevAmounts[1] - newToTokenAmount) > 0.000001) {
            return [prevAmounts[0], newToTokenAmount];
          }
          return prevAmounts;
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingSimulate(false);
    }
  }, [fromToken, toToken, operations, tokenAmounts[0], loadingSimulate]);

  /**
   * Handles user selecting a token from the asset selector.
   */
  const handleTokenClick = useCallback(
    (token: Token): void => {
      if (isFrom) {
        setFromToken(token);
        // If the selected token was the toToken, swap them
        if (toToken && token.name === toToken.name) {
          setToToken(fromToken);
        }

        // Update the tokens list, maintaining the current toToken
        setTokens((prevTokens) => {
          const filteredTokens = prevTokens.filter(
            (t) =>
              t.name !== token.name && (!toToken || t.name !== toToken.name)
          );
          // Add fromToken back to the list if it exists
          return fromToken ? [...filteredTokens, fromToken] : filteredTokens;
        });
      } else {
        setToToken(token);
        // If the selected token was the fromToken, swap them
        if (fromToken && token.name === fromToken.name) {
          setFromToken(toToken);
        }

        // Update the tokens list, maintaining the current fromToken
        setTokens((prevTokens) => {
          const filteredTokens = prevTokens.filter(
            (t) =>
              t.name !== token.name && (!fromToken || t.name !== fromToken.name)
          );
          // Add toToken back to the list if it exists
          return toToken ? [...filteredTokens, toToken] : filteredTokens;
        });
      }
      setAssetSelectorOpen(false);
      // Reset simulation flags when token changes
      operationsUpdateComplete.current = false;
    },
    [fromToken, toToken, isFrom]
  );

  /**
   * Opens the asset selector.
   */
  const handleSelectorOpen = useCallback((isFromToken: boolean): void => {
    setAssetSelectorOpen(true);
    setIsFrom(isFromToken);
  }, []);

  /**
   * Load pools data from the contract - minimizing API calls
   */
  const loadPoolsData = useCallback(async () => {
    if (hasPoolsLoaded.current) return allPools;

    try {
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

      hasPoolsLoaded.current = true;
      setAllPools(allPairs);
      appStore.setLoading(false);
      return allPairs;
    } catch (error) {
      console.error("Failed to load pools data:", error);
      appStore.setLoading(false);
      return [];
    }
  }, [appStore]);

  // Effect hook to fetch all tokens once the component mounts - with better controls
  useEffect(() => {
    if (!isClient || hasTokensLoaded.current) return;

    const getAllTokens = async () => {
      // Avoid multiple loads
      tokenLoadCount.current += 1;
      if (tokenLoadCount.current > 1) return;

      if (appStore.allTokens.length > 0) {
        // Avoid fetching if we already have tokens
        setIsLoading(false);
        setTokens(appStore.allTokens.slice(2));
        setFromToken(appStore.allTokens[0]);
        setToToken(appStore.allTokens[1]);
        hasTokensLoaded.current = true;
        appStore.setLoading(false);

        // Still load pools in the background
        setTimeout(() => {
          loadPoolsData();
        }, 500);

        return;
      }

      setIsLoading(true);
      try {
        // Load tokens first
        const allTokens = await appStore.getAllTokens();

        if (allTokens?.length > 1) {
          setTokens(allTokens.slice(2));
          setFromToken(allTokens[0]);
          setToToken(allTokens[1]);
          hasTokensLoaded.current = true;
        }
      } catch (e) {
        console.error("Failed to load tokens:", e);
      } finally {
        setIsLoading(false);
        appStore.setLoading(false);

        // Load pools separately regardless of token loading success
        setTimeout(() => {
          loadPoolsData();
        }, 500);
      }
    };

    getAllTokens();
  }, [appStore, loadPoolsData, isClient]);

  // Update operations when tokens change with stricter control to prevent infinite loops
  const updateSwapOperations = useCallback(() => {
    // Only run this once per token pair change
    if (
      !fromToken ||
      !toToken ||
      !appStore.allTokens.length ||
      !allPools.length ||
      fromToken.name === toToken.name
    ) {
      return;
    }

    // Calculate current state hash to compare
    const currentPairKey = `${fromToken.name}-${toToken.name}`;

    // Skip if operations are already up to date for this token pair
    if (prevOperations.current === currentPairKey) {
      return;
    }

    // Find token contract IDs
    const fromTokenContractID = appStore.allTokens.find(
      (token: Token) => token.name === fromToken.name
    )?.contractId;

    const toTokenContractID = appStore.allTokens.find(
      (token: Token) => token.name === toToken.name
    )?.contractId;

    if (!fromTokenContractID || !toTokenContractID) return;

    // Create a new best path
    const { operations: ops } = findBestPath(
      toTokenContractID,
      fromTokenContractID,
      allPools
    );

    if (!ops?.length) return;

    const _operations = ops.reverse();
    const _swapRoute = _operations
      .map(
        (op) =>
          appStore.allTokens.find(
            (token: any) => token.contractId === op.ask_asset
          )?.name
      )
      .filter(Boolean);

    // Update operations and swap route
    setOperations(_operations);
    setSwapRoute(`${fromToken.name} -> ${_swapRoute.join(" -> ")}`);

    // Mark that operations have been updated and save current pair
    prevOperations.current = currentPairKey;
    operationsUpdateComplete.current = true;

    // Check trustline if wallet is connected
    if (storePersist.wallet.address && toTokenContractID) {
      handleTrustLine(toTokenContractID);
    }
  }, [
    allPools,
    fromToken,
    toToken,
    appStore.allTokens,
    storePersist.wallet.address,
    handleTrustLine,
  ]);

  // Update operations when tokens or pools change - with safeguards
  useEffect(() => {
    if (!isClient || !fromToken || !toToken || !allPools.length) return;

    // Update operations only if something meaningful has changed
    updateSwapOperations();
  }, [
    isClient,
    fromToken?.name, // Only depend on the name, not the whole object
    toToken?.name, // Only depend on the name, not the whole object
    allPools.length, // Only depend on the length, not the whole array
    updateSwapOperations,
  ]);

  // Simulate swap with debounced amount changes and throttling
  useEffect(() => {
    if (!isClient) return;

    // Skip if no operations or tokens
    if (
      !fromToken ||
      !toToken ||
      !operations.length ||
      !operationsUpdateComplete.current
    ) {
      return;
    }

    // Skip if amount is zero
    if (fromAmount <= 0) {
      if (tokenAmounts[1] !== 0) {
        setTokenAmounts([tokenAmounts[0], 0]);
      }
      return;
    }

    // Use throttled simulation with a minimum interval between calls
    if (simulationRequestRef.current) {
      clearTimeout(simulationRequestRef.current);
    }

    simulationRequestRef.current = setTimeout(() => {
      doSimulateSwap();
      simulationRequestRef.current = null;
    }, 500);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (simulationRequestRef.current) {
        clearTimeout(simulationRequestRef.current);
        simulationRequestRef.current = null;
      }
    };
  }, [fromAmount, fromToken?.name, toToken?.name, operations, isClient]);

  // Memoized swap container props to prevent unnecessary re-renders
  const swapContainerProps = useMemo(
    () => ({
      onOptionsClick: () => setOptionsOpen(true),
      onSwapTokensClick: () => {
        setTokenAmounts((prevAmounts) => [prevAmounts[1], prevAmounts[0]]);
        setFromToken(toToken);
        setToToken(fromToken);
        // Reset flags when tokens are swapped
        operationsUpdateComplete.current = false;
        prevOperations.current = "";
      },
      fromTokenValue: tokenAmounts[0].toString()!,
      toTokenValue: tokenAmounts[1].toString()!,
      fromToken: fromToken!,
      toToken: toToken!,
      onTokenSelectorClick: handleSelectorOpen,
      onSwapButtonClick: doSwap,
      onInputChange: (isFrom: boolean, value: string) => {
        const numValue = Number(value) || 0;
        setTokenAmounts((prevAmounts) => {
          if (isFrom) {
            if (prevAmounts[0] === numValue) return prevAmounts;
            return [numValue, prevAmounts[1]];
          } else {
            if (prevAmounts[1] === numValue) return prevAmounts;
            return [prevAmounts[0], numValue];
          }
        });
      },
      exchangeRate,
      networkFee,
      route: swapRoute,
      loadingSimulate,
      estSellPrice: "TODO",
      minSellPrice: "TODO",
      slippageTolerance: `${maxSpread}%`,
      swapButtonDisabled: tokenAmounts[0] <= 0 || !storePersist.wallet.address,
      trustlineButtonActive,
      trustlineAssetName: trustlineTokenSymbol,
      trustlineButtonDisabled: trustlineAssetAmount < 0.5,
      onTrustlineButtonClick: addTrustLine,
    }),
    [
      tokenAmounts,
      fromToken,
      toToken,
      exchangeRate,
      networkFee,
      swapRoute,
      loadingSimulate,
      maxSpread,
      trustlineButtonActive,
      trustlineTokenSymbol,
      trustlineAssetAmount,
      storePersist.wallet.address,
      doSwap,
      handleSelectorOpen,
      addTrustLine,
    ]
  );

  return (
    <>
      {/* Hacky Title Injector - Only on client side */}
      {isClient && (
        <input type="hidden" value="Phoenix DeFi Hub - Swap your tokens" />
      )}

      {isLoading || !isClient ? (
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
                <SwapContainer {...swapContainerProps} />
              </motion.div>
            )}
            {optionsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ maxWidth: "600px", margin: "auto" }}>
                  <SlippageSettings
                    options={[1, 3, 5]}
                    selectedOption={maxSpread}
                    onClose={() => setOptionsOpen(false)}
                    onChange={(option: number) => setMaxSpread(option)}
                  />
                </Box>
              </motion.div>
            )}
            {assetSelectorOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {tokens.length > 0 ? (
                  <Box sx={{ maxWidth: "600px", margin: "auto" }}>
                    <AssetSelector
                      tokens={tokens}
                      tokensAll={tokens}
                      onClose={() => setAssetSelectorOpen(false)}
                      onTokenClick={handleTokenClick}
                    />
                  </Box>
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
