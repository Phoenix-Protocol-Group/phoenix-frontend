"use client";

import { SwapError, SwapSuccess } from "@/components/Modal/Modal";
import { Box } from "@mui/material";
import {
  PhoenixFactoryContract,
  PhoenixMultihopContract,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  AssetSelector,
  SlippageSettings,
  SwapContainer,
  Token,
} from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import React, { useEffect } from "react";
import { Address } from "soroban-client";

const args = {
  SwapContainerArgs: {
    fromToken: {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    },
    toToken: {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    },
    exchangeRate: "1 BTC = 26,567 USDT ($26,564)",
    networkFee: "0.0562 USDT (~$0.0562)",
    route: "Trycryptousd",
    estSellPrice: "0.0562 USDT (~$0.0562)",
    minSellPrice: "0.0562 USDT (~$0.0562)",
    slippageTolerance: "0.1%",
  },
  AssetSelectorArgs: {
    tokens: [
      {
        name: "USDT",
        icon: "cryptoIcons/usdt.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
      },
      {
        name: "DAI",
        icon: "cryptoIcons/dai.svg",
        amount: 25,
        category: "Stable",
        usdValue: 1 * 25,
      },
      {
        name: "XLM",
        icon: "cryptoIcons/xlm.svg",
        amount: 200,
        category: "Non-Stable",
        usdValue: 0.85 * 200,
      },
      {
        name: "BTC",
        icon: "cryptoIcons/btc.svg",
        amount: 0.5,
        category: "Non-Stable",
        usdValue: 30000 * 0.5,
      },
    ],
  },
};

const testTokenA = "CC5BDQ7J2VK4TQHHIMFNVMV5ZJZYDXDZN7XQ7IM73XKKPYF2KKARCOIW";
const testTokenB = "CC6HQVYSKVFCKWU6EKYDILHFOV5DC26VICEUYAMKTIDS4XZPYMDP3WOS";

export default function Page() {
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = React.useState(false);
  const [isFrom, setIsFrom] = React.useState(true);

  const [sucessModalOpen, setSuccessModalOpen] = React.useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState<boolean>(false);
  const [errorDescription, setErrorDescripption] = React.useState<string>("");
  const [tokenAmounts, setTokenAmounts] = React.useState<number[]>([0]);
  const [tokens, setTokens] = React.useState<any>([]);
  const storePersist = usePersistStore();
  const appStore = useAppStore();

  const doSwap = async () => {
    const contract = new PhoenixMultihopContract.Contract({
      contractId: constants.MULTIHOP_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const tx = await contract.swap({
      recipient: Address.fromString(storePersist.wallet.address!),
      operations: [
        {
          ask_asset: Address.fromString(testTokenB),
          offer_asset: Address.fromString(testTokenA),
        },
      ],
      amount: BigInt(1000),
    });

    console.log(tx);
  };

  const handleTokenClick = (token: Token) => {
    if (isFrom) {
      args.SwapContainerArgs.fromToken = token;
    } else {
      args.SwapContainerArgs.toToken = token;
    }

    setAssetSelectorOpen(false);
  };

  const handleSelectorOpen = (isFromToken: boolean) => {
    setAssetSelectorOpen(true);
    setIsFrom(isFromToken);
  };

  useEffect(() => {
    const getAllTokens = async () => {
      const allTokens = await appStore.getAllTokens();
      setTokens(allTokens);
    };
    getAllTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

  return (
    <Box sx={{ width: "100%", maxWidth: "600px" }}>
      <SwapSuccess
        open={sucessModalOpen}
        setOpen={setSuccessModalOpen}
        //todo add tokens
        tokens={[
          args.SwapContainerArgs.fromToken,
          args.SwapContainerArgs.toToken,
        ]}
        tokenAmounts={tokenAmounts}
        onButtonClick={() => {}}
      />
      {errorModalOpen && (
        <SwapError
          open={errorModalOpen}
          setOpen={setErrorModalOpen}
          error={errorDescription}
        />
      )}
      <Box>
        {!optionsOpen && !assetSelectorOpen && (
          <SwapContainer
            {...args.SwapContainerArgs}
            onOptionsClick={() => setOptionsOpen(true)}
            onSwapTokensClick={() => {}}
            onTokenSelectorClick={(isFromToken) =>
              handleSelectorOpen(isFromToken)
            }
            onSwapButtonClick={() => doSwap()}
            onInputChange={() => {}}
          />
        )}

        {optionsOpen && (
          <SlippageSettings
            options={["0.1%", "0.5%", "2%"]}
            selectedOption={0}
            onClose={() => setOptionsOpen(false)}
            onChange={() => {}}
          />
        )}

        {assetSelectorOpen && (
          <AssetSelector
            tokens={tokens}
            tokensAll={tokens}
            onClose={() => setAssetSelectorOpen(false)}
            onTokenClick={handleTokenClick}
          />
        )}
      </Box>
    </Box>
  );
}
