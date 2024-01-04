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
import { PhoenixMultihopContract } from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { constants, findBestPath } from "@phoenix-protocol/utils";
import { SwapError, SwapSuccess } from "@/components/Modal/Modal";
import { Alert, Box } from "@mui/material";
import { init } from "next/dist/compiled/@vercel/og/satori";

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
  const [maxSpread, setMaxSpread] = useState<number>(0);
  const [toToken, setToToken] = useState<Token>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapRoute, setSwapRoute] = useState<string>("");
  const [operations, setOperations] = useState<any[]>([]);

  // Simulate swap states
  const [loadingSimulate, setLoadingSimulate] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [networkFee, setNetworkFee] = useState<string>("");

  // Using the store
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  const [fromAmount] = useDebounce(tokenAmounts[0], 500);

  // Function for handling token swapping logic
  const doSwap = async () => {
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
        referral: undefined,
        max_spread_bps: BigInt((maxSpread + 1) * 100),
        max_belief_price: undefined,
      });

      const result = await tx.signAndSend();

      if (result.getTransactionResponse?.status === "FAILED") {
        setErrorModalOpen(true);

        // @ts-ignore
        setErrorDescription(tx?.resultXdr);

        return;
      }
      setSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Function for simulating swap
  const doSimulateSwap = async () => {
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

      if (tx.result.ask_amount && tx.result.total_commission_amount) {
        const _exchangeRate =
          (Number(tx.result.ask_amount) -
            Number(tx.result.total_commission_amount)) /
          Number(tokenAmounts[0]);

        setExchangeRate(
          `${(_exchangeRate / 10 ** 7).toFixed(2)} ${toToken?.name} per ${
            fromToken?.name
          }`
        );
        setNetworkFee(
          `${Number(tx.result.total_commission_amount) / 10 ** 7} ${
            fromToken?.name
          }`
        );

        setTokenAmounts([
          tokenAmounts[0],
          Number(tx.result.ask_amount) / 10 ** 7,
        ]);
      }

      console.log(tx);
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
    if (fromToken && toToken) {
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
        fromTokenContractID
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
    }
  }, [fromToken, toToken, appStore.allTokens]);

  // Return statement for rendering components conditionally based on state
  return isLoading ? (
    <Skeleton.Swap />
  ) : (
    // JSX for UI when data is loaded
    <Box sx={{ width: "100%", maxWidth: "600px" }}>
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
            slippageTolerance={`${maxSpread + 1}%`}
            swapButtonDisabled={
              tokenAmounts[0] <= 0 || storePersist.wallet.address === undefined
            }
          />
        )}
        {/* Options Modal for Setting Slippage Tolerance */}
        {optionsOpen && (
          <SlippageSettings
            options={["1%", "2%", "3%"]}
            selectedOption={maxSpread}
            onClose={() => setOptionsOpen(false)}
            onChange={(e) => {
              setMaxSpread(Number(e.target.value));
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
