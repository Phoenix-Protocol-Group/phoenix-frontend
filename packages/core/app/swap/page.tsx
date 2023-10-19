"use client";

// React-related imports
import React, { useEffect, useState } from "react";

// Component and utility imports
import {
  AssetSelector,
  Skeleton,
  SlippageSettings,
  SwapContainer,
  Token,
} from "@phoenix-protocol/ui";
import { PhoenixMultihopContract } from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { constants, findBestPath } from "@phoenix-protocol/utils";
import { SwapError, SwapSuccess } from "@/components/Modal/Modal";
import { Alert, Box } from "@mui/material";
import { Address } from "soroban-client";

export default function SwapPage() {
  // State variables declaration and initialization
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [isFrom, setIsFrom] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDescription, setErrorDescription] = useState("");
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token>();
  const [maxSpread, setMaxSpread] = useState<number>(0);
  const [toToken, setToToken] = useState<Token>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapRoute, setSwapRoute] = useState<string>("");
  const [operations, setOperations] = useState<any[]>([]);

  // Using the store
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  // Function for handling token swapping logic
  const doSwap = async () => {
    try {
      // Create contract instance
      const contract = new PhoenixMultihopContract.Contract({
        contractId: constants.MULTIHOP_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });
      console.log(operations);

      // Execute swap
      const tx = await contract.swap({
        recipient: Address.fromString(storePersist.wallet.address!),
        operations: operations,
        amount: BigInt(tokenAmounts[0] * 10 ** 7),
      });

      // @ts-ignore
      if (tx?.status === "FAILED") {
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

      console.log(_operations);
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
      <Alert severity="warning">
        Only direct pool swaps work for now! Unfortunately we are reaching
        memory limits on the testnet with multi-pool swaps. Stay tuned for
        updates!
      </Alert>
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
              setFromToken(toToken);
              setToToken(fromToken);
            }}
            fromToken={fromToken}
            toToken={toToken}
            onTokenSelectorClick={(isFromToken) =>
              handleSelectorOpen(isFromToken)
            }
            onSwapButtonClick={() => doSwap()}
            onInputChange={(isFrom, value) => {
              if (isFrom) {
                setTokenAmounts([Number(value), 0]);
              } else {
                setTokenAmounts([0, Number(value)]);
              }
            }}
            exchangeRate={"TODO"}
            networkFee={"TODO"}
            route={swapRoute}
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
