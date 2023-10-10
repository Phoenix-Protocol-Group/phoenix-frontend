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
import { constants } from "@phoenix-protocol/utils";
import { SwapError, SwapSuccess } from "@/components/Modal/Modal";
import { Box } from "@mui/material";
import { Address } from "soroban-client";

const TEST_TOKEN_A = "CBWK2ZG5YWF6ZMLVEKTN4LZZKOHRD6UNS356AGFQKZGPMR3HUGZ6NKVT";
const TEST_TOKEN_B = "CD2QZU2HFAV37GTZBRBXA7RDWI2JD4UPIQGDSVM2DGNVMZUQ4VPFLDQZ";

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

  // Using the store
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  // Function for handling token swapping logic
  const doSwap = async () => {
    // Create contract instance
    const contract = new PhoenixMultihopContract.Contract({
      contractId: constants.MULTIHOP_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    // Execute swap
    const tx = await contract.swap({
      recipient: Address.fromString(storePersist.wallet.address!),
      operations: [
        {
          ask_asset: Address.fromString(TEST_TOKEN_B),
          offer_asset: Address.fromString(TEST_TOKEN_A),
        },
      ],
      amount: BigInt(100000000),
    });

    console.log(tx);
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
              setFromToken(toToken);
              setToToken(fromToken);
            }}
            fromToken={fromToken}
            toToken={toToken}
            onTokenSelectorClick={(isFromToken) =>
              handleSelectorOpen(isFromToken)
            }
            onSwapButtonClick={() => doSwap()}
            onInputChange={() => {}}
            exchangeRate={"1 BTC = 26,567 USDT ($26,564)"}
            networkFee={"0.0562 USDT (~$0.0562)"}
            route={"Trycryptousd"}
            estSellPrice={"0.0562 USDT (~$0.0562)"}
            minSellPrice={"0.0562 USDT (~$0.0562)"}
            slippageTolerance={`${maxSpread + 1}%`}
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
