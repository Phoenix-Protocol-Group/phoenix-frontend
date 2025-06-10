import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { AppBar } from "../../AppBar/AppBar";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";
import MailIcon from "@mui/icons-material/Mail";
import { SwapContainer } from "../SwapContainer/SwapContainer";
import { SlippageSettings } from "../SlippageSettings/SlippageSettings";
import { AssetSelector } from "../AssetSelector/AssetSelector";
import { Token } from "@phoenix-protocol/types";

const args = {
  navItems: [
    {
      label: "Nav Item 1",
      icon: <MailIcon />,
      active: true,
      href: "#",
    },
    {
      label: "Nav Item 2",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Nav Item 3",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Nav Item 4",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
  ],
  appBarArgs: {
    balance: 125.5,
    walletAddress: "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
    connectWallet: () => {},
    disconnectWallet: () => {},
  },
  SwapContainerArgs: {
    fromToken: {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
      contractId: "usdt-token",
    },
    toToken: {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
      contractId: "usdt-token",
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
        contractId: "usdt-token",
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
        contractId: "usdc-token",
      },
      {
        name: "DAI",
        icon: "cryptoIcons/dai.svg",
        amount: 25,
        category: "Stable",
        usdValue: 1 * 25,
        contractId: "dai-token",
      },
      {
        name: "XLM",
        icon: "cryptoIcons/xlm.svg",
        amount: 200,
        category: "Non-Stable",
        usdValue: 0.85 * 200,
        contractId: "xlm-token",
      },
      {
        name: "BTC",
        icon: "cryptoIcons/btc.svg",
        amount: 0.5,
        category: "Non-Stable",
        usdValue: 30000 * 0.5,
        contractId: "btc-token",
      },
    ],
  },
};

const SwapPage = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(largerThenMd ? true : false);

  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = React.useState(false);
  const [isFrom, setIsFrom] = React.useState(true);

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

  return (
    <Box sx={{}}>
      <SidebarNavigation
        onNavClick={() => {}}
        items={args.navItems}
        open={navOpen}
        setOpen={setNavOpen}
      />
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        {...args.appBarArgs}
      />
      <Box
        sx={{
          marginLeft: largerThenMd
            ? navOpen
              ? "240px"
              : "60px"
            : navOpen
            ? "240px"
            : "0",
          width: largerThenMd
            ? navOpen
              ? "calc(100% - 240px)"
              : "calc(100% - 60px)"
            : navOpen
            ? "0"
            : "100%",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          justifyContent: "center",
          minHeight: { xs: "calc(100vh - 70px)", md: "100vh" },
          px: { xs: "8px", sm: "16px", md: "24px" },
        }}
      >
        {!optionsOpen && !assetSelectorOpen && (
          <SwapContainer
            {...args.SwapContainerArgs}
            onOptionsClick={() => setOptionsOpen(true)}
            onTrustlineButtonClick={() => {}}
            trustlineAssetName="USDT"
            onSwapTokensClick={() => {}}
            onTokenSelectorClick={(isFromToken) =>
              handleSelectorOpen(isFromToken)
            }
            onSwapButtonClick={() => {}}
            onInputChange={() => {}}
          />
        )}

        {optionsOpen && (
          <SlippageSettings
            options={[1, 2, 5]}
            selectedOption={0}
            onClose={() => setOptionsOpen(false)}
            onChange={() => {}}
          />
        )}

        {assetSelectorOpen && (
          <AssetSelector
            tokens={args.AssetSelectorArgs.tokens}
            tokensAll={[
              ...args.AssetSelectorArgs.tokens,
              ...args.AssetSelectorArgs.tokens,
              ...args.AssetSelectorArgs.tokens,
            ]}
            onClose={() => setAssetSelectorOpen(false)}
            onTokenClick={handleTokenClick}
          />
        )}
      </Box>
    </Box>
  );
};

export { SwapPage };
