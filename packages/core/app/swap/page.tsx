"use client";

// React-related imports
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

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
  Address,
  checkTrustline,
  constants,
  fetchAndIssueTrustline,
  fetchTokenPrices,
  findBestPath,
  resolveContractError,
} from "@phoenix-protocol/utils";
import {
  SwapError,
  SwapSuccess,
  Loading,
  LoadingSwap,
} from "@/components/Modal/Modal";
import { Alert, Box } from "@mui/material";
import { init } from "next/dist/compiled/@vercel/og/satori";
import { Helmet } from "react-helmet";

export default function SwapPage() {
  // State variables declaration and initialization
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [isFrom, setIsFrom] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDescription, setErrorDescription] = useState("");
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0, 0]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token>();
  const [maxSpread, setMaxSpread] = useState<number>(1);
  const [toToken, setToToken] = useState<Token>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapRoute, setSwapRoute] = useState<string>("");
  const [operations, setOperations] = useState<any[]>([]);
  const [txBroadcasting, setTxBroadcasting] = useState<boolean>(false);

  // Simulate swap states
  const [loadingSimulate, setLoadingSimulate] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [networkFee, setNetworkFee] = useState<string>("");

  const [fromTokenValue, setFromTokenValue] = useState<number>(0);
  const [toTokenValue, setToTokenValue] = useState<number>(0);

  // Trustline
  const [trustlineButtonActive, setTrustlineButtonActive] =
    useState<boolean>(false);
  const [trustlineTokenName, setTrustlineTokenName] = useState<string>("");
  const [trustlineTokenContract, setTrustlineTokenContract] =
    useState<string>("");
  const [trustlineAssetAmount, setTrustlineAssetAmount] = useState<number>(0);

  // All Pools
  const [allPools, setAllPools] = useState<any[]>([]);

  // Using the store
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  const [fromAmount] = useDebounce(tokenAmounts[0], 500);

  // Function for handling token swapping logic
  const doSwap = async () => {
    setTxBroadcasting(true);
    try {
      // Create contract instance
      const contract = new PhoenixMultihopContract.Contract({
        contractId: constants.MULTIHOP_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      // Execute swap
      const tx = await contract.swap({
        recipient: storePersist.wallet.address!,
        operations: operations,
        amount: BigInt(tokenAmounts[0] * 10 ** 7),
        max_spread_bps: BigInt(maxSpread * 100),
      });

      const result = await tx.signAndSend();

      if (result.getTransactionResponse?.status === "FAILED") {
        setErrorModalOpen(true);

        // @ts-ignore
        setErrorDescription(tx?.resultXdr);

        setTxBroadcasting(false);
        return;
      }
      setSuccessModalOpen(true);
    } catch (e: any) {
      setErrorModalOpen(true);

      // @ts-ignore
      setErrorDescription((typeof e === "string") ? e : e.message.includes("request denied") ? e.message : resolveContractError(e.message));
      setTxBroadcasting(false);
    }
    setTxBroadcasting(false);
  };

  // Function for simulating swap
  const doSimulateSwap = async () => {
    if (fromToken && toToken) {
      const fromTokenValue = await fetchTokenPrices(fromToken.name || "");
      const toTokenValue = await fetchTokenPrices(toToken.name || "");

      setFromTokenValue(fromTokenValue);
      setToTokenValue(toTokenValue);
    }
    setLoadingSimulate(true);
    try {
      const contract = new PhoenixMultihopContract.Contract({
        contractId: constants.MULTIHOP_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      const tx = await contract.simulateSwap({
        operations: operations,
        amount: BigInt(tokenAmounts[0] * 10 ** 7),
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

        // TODO: Adjust network fee and iterate through amounts
        setNetworkFee(
          `${Number(tx.result.commission_amounts[0][1]) / 10 ** 7} ${
            fromToken?.name
          }`
        );

        setTokenAmounts([
          tokenAmounts[0],
          Number(tx.result.ask_amount) / 10 ** 7,
        ]);
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingSimulate(false);
  };

  // Function for handling token click
  const handleTokenClick = (token: Token) => {
    // Update tokens based on selected token and close the asset selector
    if (isFrom) {
      setTokens([
        ...tokens.filter((el) => el.name !== token.name),
        ...(fromToken ? [fromToken] : []),
      ]);
      setFromToken(token);
    } else {
      setTokens([
        ...tokens.filter((el) => el.name !== token.name),
        ...(toToken ? [toToken] : []),
      ]);

      setToToken(token);
    }
    setAssetSelectorOpen(false);
  };

  // Function for handling the opening of the selector with state management
  const handleSelectorOpen = (isFromToken: boolean) => {
    setAssetSelectorOpen(true);
    setIsFrom(isFromToken);
  };

  // Method for handling user tour events
  const initUserTour = () => {
    // Check if the user has already skipped the tour
    if (storePersist.userTour.skipped && !storePersist.userTour.active) {
      return;
    }

    // If the user has started the tour, we need to resume it from the last step
    if (storePersist.userTour.active) {
      appStore.setTourRunning(true);
      appStore.setTourStep(3);
    }
  };

  // Effect hook to fetch all tokens once the component mounts
  useEffect(() => {
    const getAllTokens = async () => {
      setIsLoading(true);
      const allTokens = await appStore.getAllTokens();
      setTokens(allTokens.slice(2));
      setFromToken(allTokens[0]);
      setToToken(allTokens[1]);
      setIsLoading(false);
      // Get all pools
      const factoryContract = new PhoenixFactoryContract.Contract({
        contractId: constants.FACTORY_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      // Fetch all available tokens from chain
      const { result } = await factoryContract.queryAllPoolsDetails();

      const allPairs = result.map((pool: any) => {
        return {
          asset_a: pool.pool_response.asset_a.address,
          asset_b: pool.pool_response.asset_b.address,
        };
      });
      setAllPools(allPairs);
      const fromTokenContractID = allTokens[0].contractId;
      const toTokenContractID = allTokens[1].contractId;
      if (!fromTokenContractID || !toTokenContractID) {
        console.log("no from or to token");
        return;
      }
      const { operations: ops } = findBestPath(
        toTokenContractID,
        fromTokenContractID,
        allPairs
      );
      const _operations = ops.reverse();
      const _swapRoute: string[] = _operations.map((op, index) => {
        const toAssetName = appStore.allTokens.find(
          (token: any) => token.contractId === op.ask_asset
        )?.name;
        return toAssetName;
      });
      setOperations(_operations);
      const swapRoute_ = allTokens[0].name + " -> " + _swapRoute.join(" -> ");
      setSwapRoute(swapRoute_);
    };

    getAllTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

  // Effect hook to initialize the user tour delayed to avoid hydration issues
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        initUserTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Effect hook to simualte swaps on token change
  useEffect(() => {
    if (fromToken && toToken && operations.length > 0) {
      doSimulateSwap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toToken, fromToken, fromAmount]);

  useEffect(() => {
    if (fromToken && toToken) {
      const fromTokenContractID = appStore.allTokens.find(
        (token: any) => token.name === fromToken.name
      )?.contractId;

      const toTokenContractID = appStore.allTokens.find(
        (token: any) => token.name === toToken.name
      )?.contractId;

      if (!fromTokenContractID || !toTokenContractID) {
        return;
      }

      const { operations: ops } = findBestPath(
        toTokenContractID,
        fromTokenContractID,
        allPools
      );

      const _operations = ops.reverse();

      const _swapRoute: string[] = _operations.map((op, index) => {
        const toAssetName = appStore.allTokens.find(
          (token: any) => token.contractId === op.ask_asset
        )?.name;

        return toAssetName;
      });
      setOperations(_operations);
      const swapRoute_ = fromToken.name + " -> " + _swapRoute.join(" -> ");
      setSwapRoute(swapRoute_);
      if (storePersist.wallet.address) {
        handleTrustLine(toTokenContractID);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, allPools]);

  const handleTrustLine = async (tokenAddress: string) => {
    // Check if trustline exists
    const trust = await checkTrustline(
      storePersist.wallet.address!,
      tokenAddress
    );

    setTrustlineButtonActive(!trust.exists);
    setTrustlineTokenName(trust.asset?.code || "");
    const tlAsset = await appStore.fetchTokenInfo(
      Address.fromString(
        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
      )
    );
    setTrustlineAssetAmount(
      Number(tlAsset?.balance) / 10 ** tlAsset?.decimals!
    );
    setTrustlineTokenContract(trust.asset?.contract || "");
  };

  const addTrustLine = async () => {
    try {
      setTxBroadcasting(true);
      await fetchAndIssueTrustline(
        storePersist.wallet.address!,
        trustlineTokenContract
      );
      setTrustlineButtonActive(false);
    } catch (e) {
      console.error(e);
    }
    setTxBroadcasting(false);
  };

  // Return statement for rendering components conditionally based on state
  return isLoading ? (
    <Box sx={{ width: "100%", maxWidth: "600px", mt: 12 }}>
      <Skeleton.Swap />
    </Box>
  ) : (
    // JSX for UI when data is loaded
    <Box sx={{ width: "100%", maxWidth: "600px", mt: 12 }}>
      <Helmet>
        <title>Phoenix DeFi Hub - Swap your tokens</title>
      </Helmet>
      {/* Success Modal */}
      {fromToken && toToken && (
        <SwapSuccess
          open={successModalOpen}
          setOpen={setSuccessModalOpen}
          tokens={[fromToken, toToken]}
          tokenAmounts={tokenAmounts}
          onButtonClick={() => {}}
        />
      )}
      {/* Error Modal */}
      {errorModalOpen && (
        <SwapError
          open={errorModalOpen}
          setOpen={setErrorModalOpen}
          error={errorDescription}
        />
      )}
      <LoadingSwap
        open={txBroadcasting}
        setOpen={setTxBroadcasting}
        toToken={toToken!}
        fromToken={fromToken!}
      />
      <Box>
        {/* Main Swap Container */}
        {!optionsOpen && !assetSelectorOpen && fromToken && toToken && (
          <SwapContainer
            onOptionsClick={() => setOptionsOpen(true)}
            onSwapTokensClick={() => {
              setTokenAmounts([tokenAmounts[1], tokenAmounts[0]]);
              setFromToken(toToken);
              setToToken(fromToken);
            }}
            fromTokenValue={tokenAmounts[0].toString()}
            toTokenValue={tokenAmounts[1].toString()}
            fromToken={fromToken}
            toToken={toToken}
            onTokenSelectorClick={(isFromToken) =>
              handleSelectorOpen(isFromToken)
            }
            onSwapButtonClick={() => doSwap()}
            onInputChange={(isFrom, value) => {
              if (isFrom) {
                setTokenAmounts([Number(value), tokenAmounts[1]]);
              } else {
                setTokenAmounts([0, Number(value)]);
              }
            }}
            exchangeRate={exchangeRate}
            networkFee={networkFee}
            route={swapRoute}
            loadingSimulate={loadingSimulate}
            estSellPrice={"TODO"}
            minSellPrice={"TODO"}
            slippageTolerance={`${maxSpread}%`}
            swapButtonDisabled={
              tokenAmounts[0] <= 0 || storePersist.wallet.address === undefined
            }
            trustlineButtonActive={trustlineButtonActive}
            trustlineAssetName={trustlineTokenName}
            trustlineButtonDisabled={trustlineAssetAmount < 0.5}
            onTrustlineButtonClick={() => addTrustLine()}
          />
        )}
        {/* Options Modal for Setting Slippage Tolerance */}
        {optionsOpen && (
          <SlippageSettings
            options={["1%", "3%", "5%"]}
            selectedOption={maxSpread}
            onClose={() => setOptionsOpen(false)}
            onChange={(option: string) => {
              setMaxSpread(Number(option));
            }}
          />
        )}
        {/* Asset Selector UI */}
        {assetSelectorOpen &&
          (tokens.length > 0 ? (
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
          ))}
      </Box>
    </Box>
  );
}
