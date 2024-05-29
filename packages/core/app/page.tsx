"use client";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Helmet } from "react-helmet";
import "./style.css";
import {
  CryptoCTA,
  DashboardPriceCharts,
  DashboardStats,
  WalletBalanceTable,
  AnchorServices,
  Skeleton,
  AssetInfoModal,
  VestedTokensModal,
} from "@phoenix-protocol/ui";

import { fetchPho, SorobanTokenContract, PhoenixVestingContract } from "@phoenix-protocol/contracts";

import { useEffect, useState } from "react";
import {
  DepositManager,
  getAllAnchors,
} from "@phoenix-protocol/utils/build/sep24";
import { Anchor, AssetInfo } from "@phoenix-protocol/types";
import {
  constants,
  fetchBiggestWinnerAndLoser,
  fetchHistoricalPrices,
  fetchTokenPrices,
  fetchTokenPrices2,
  formatCurrency,
  resolveContractError,
  Signer,
} from "@phoenix-protocol/utils";
import { VestingError, VestingSuccess } from "@/components/Modal/Modal";

export default function Page() {
  const theme = useTheme();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [gainerAsset, setGainerAsset] = useState<any>({});
  const [loserAsset, setLoserAsset] = useState<any>({});
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [xlmPrice, setXlmPrice] = useState<number>(0);
  const [xlmPriceChange, setXlmPriceChange] = useState<number>(0);
  const [usdcPrice, setUsdcPrice] = useState(0);
  const [disclaimer, setDisclaimer] = useState(true);
  const [selectedTokenForInfo, setSelectedTokenForInfo] = useState<AssetInfo>();
  const [tokenInfoOpen, setTokenInfoOpen] = useState<boolean>(false);
  const [xlmPriceChart, setXlmPriceChart] = useState<any[]>([]);
  const [phoPriceChart, setPhoPriceChart] = useState<any[]>([]);

  //vesting modal states
  const [vestingInfo, setVestingInfo] = useState<PhoenixVestingContract.VestingInfo[]>([]);
  const [vestingIndexes, setVestingIndexes] = useState<number[]>([]);
  const [vestingModalOpen, setVestingModalOpen] = useState<boolean>(false);
  const [claimSuccessModalOpen, setClaimSuccessModalOpen] = useState<boolean>(false);
  const [claimErrorModalOpen, setClaimErrorModalOpen] = useState<boolean>(false);
  const [claimErrorMessage, setClaimErrorMessage] = useState<string>("");
  const [claimTransactionLoading, setClaimTransactionLoading] = useState<boolean>(false);

  // Loading states
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const authenticate = async (anchor: Anchor) => {
    const manager = new DepositManager(anchor, persistStore.wallet.address!);
    const transferServer = await manager.openTransferServer();
    return true;
  };

  const sign = async (anchor: Anchor) => {
    const manager = new DepositManager(anchor, persistStore.wallet.address!);
    const transferServer = await manager.openTransferServer();
    const { depositableAssets: supportedAssets } =
      await manager.fetchTransferInfos(transferServer);
    const token = await manager.startSep10Auth(transferServer);
    await manager.handleDeposit(transferServer, supportedAssets, token);
    return true;
  };

  const initAnchor = async () => {
    const allAnchors = await getAllAnchors();
    setAnchors(allAnchors);
  };

  const getBiggestGainerAndLoser = async () => {
    setLoadingDashboard(true);
    const { winner, loser } = await fetchBiggestWinnerAndLoser();

    // Resolve names by fetching all assets
    const _allTokens = await appStore.getAllTokens();

    const _winner = _allTokens.find((token: any) => token.name === winner.symbol);
    const _loser = _allTokens.find((token: any) => token.name === loser.symbol);

    const _gainerAsset = {
      name: _winner.name,
      symbol: _winner.name,
      price: formatCurrency("USD", winner.price.toString(), navigator.language),
      change: winner.percent_change_24,
      icon: `/cryptoIcons/${winner.symbol.toLowerCase()}.svg`,
      volume: "TBD",
    };

    const _loserAsset = {
      name: _loser.name,
      symbol: _loser.name,
      price: formatCurrency("USD", loser.price.toString(), navigator.language),
      change: loser.percent_change_24,
      icon: `/cryptoIcons/${loser.symbol.toLowerCase()}.svg`,
      volume: "TBD",
    };

    setGainerAsset(_gainerAsset);
    setLoserAsset(_loserAsset);
    setLoadingDashboard(false);
  };

  const getVestedTokens = async () => {
    if(!persistStore.wallet.address) return [];

    const VestingContract = new PhoenixVestingContract.Client({
      contractId: constants.VESTING_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL
    });

    return VestingContract.query_all_vesting_info({
      address: persistStore.wallet.address //@TODO handle more vested tokens than just pho
    })
  }

  const claimVestedTokens = async (index: number) => {
    const vestingSigner = new Signer();

    setClaimTransactionLoading(true);

    try {
      const VestingContract = new PhoenixVestingContract.Client({
        publicKey: persistStore.wallet.address!,
        contractId: constants.VESTING_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        signTransaction: (tx: string) => vestingSigner.sign(tx),
      });

      const tx = await VestingContract.claim({
        sender: persistStore.wallet.address,
        index: BigInt(index)
      })
  
      const result = await tx.signAndSend();

      if (result.getTransactionResponse?.status === "FAILED") {
        setClaimErrorModalOpen(true);

        // @ts-ignore
        setClaimErrorMessage(tx?.resultXdr);

        setClaimTransactionLoading(false);
        return;
      }

      setVestingModalOpen(false);
      setClaimSuccessModalOpen(true);
    } catch (e: any) {
      setClaimTransactionLoading(false);

      setClaimErrorMessage(
        typeof e === "string"
          ? e
          : e.message.includes("request denied")
          ? e.message
          : resolveContractError(e.message)
      );

      setClaimErrorModalOpen(true);
    }
  }

  const loadAllBalances = async () => {
    setLoadingBalances(true);
    const _allTokens = await appStore.getAllTokens();
    const _vestingInfo = await getVestedTokens();
    setAllTokens(_allTokens);
    setVestingInfo(_vestingInfo.result);
    setLoadingBalances(false);
  };

  useEffect(() => {
    loadAllBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistStore.wallet.address]);

  useEffect(() => {
    initAnchor();
    getBiggestGainerAndLoser();
    getXlmPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const indexes: number[] = [];

    if(!vestingInfo) return;

    vestingInfo.map((info: any, _index: number) => {
      const { max_x } = info.schedule.values[0];

      const balance = parseInt(info.balance, 10);
      const maxX = parseInt(max_x, 10);

      if (balance === 0 || maxX < Math.floor(maxX / 1000)) {
        return;
      }

      indexes.push(_index);
    });

    setVestingIndexes(indexes);
  }, [vestingInfo])

  const getXlmPrice = async () => {
    const price = await fetchTokenPrices("XLM");
    const price2 = await fetchTokenPrices("USDC");
    const priceChangeXLM = await fetchTokenPrices2("XLM");
    const phoPrice = await fetchPho();

    setXlmPrice(price);
    setUsdcPrice(phoPrice);
    setXlmPriceChange(priceChangeXLM);

    const xlmPrices = await fetchHistoricalPrices(1440, "XLM", undefined, 20);
    setXlmPriceChart(xlmPrices);

    const phoPrices = await fetchHistoricalPrices(1440, "PHO", undefined, 20);
    setPhoPriceChart(phoPrices);
  };

  const fetchTokenInfo = async (tokenId: string) => {
    const TokenContract = new SorobanTokenContract.Client({
      contractId: tokenId,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });
    const tokenName = (await TokenContract.name()).result
      .toLowerCase()
      .replace(":", "-");

    const fetchedInfo = await (
      await fetch(
        `https://api.stellar.expert/explorer/public/asset?search=${tokenName}`
      )
    ).json();

    const info = fetchedInfo._embedded.records.find(
      (el: any) =>
        el.asset === tokenName.toUpperCase() ||
        el.asset === tokenName.toUpperCase() + "-1" ||
        el.asset === tokenName.toUpperCase() + "-2"
    );

    setSelectedTokenForInfo(info);
    setTokenInfoOpen(true);
  };

  const args = {
    mainstatsArgs: {
      stats: [
        {
          title: "Total Assets",
          value: "$100,000",
          link: "https://google.com",
        },
        {
          title: "Total Rewards",
          value: "$100,000",
          link: "https://google.com",
        },
        {
          title: "Staked Phoenix",
          value: "$100,000",
          link: "https://google.com",
        },
      ],
    },
    dashboardArgs1: {
      data: xlmPriceChart,
      icon: {
        small: "/image-103.png",
        large: "/image-stellar.png",
      },
      assetName: "XLM",
    },
    dashboardArgs2: {
      data: phoPriceChart,
      icon: {
        small: "/cryptoIcons/pho.svg",
        large: "/pho-bg.png",
      },
      assetName: "PHO",
    },
    dashboardStatsArgs: {
      gainer: gainerAsset,
      loser: loserAsset,
      availableAssets: "$100,000",
      lockedAssets: "$100,000",
    },
  };

  return (
    <Box sx={{ marginTop: { md: 0, xs: 12 } }}>
      <Helmet>
        <title>Phoenix DeFi Hub - Dashboard</title>
      </Helmet>
      {anchors.length > 0 && (
        <AnchorServices
          anchors={anchors}
          open={anchorOpen}
          authenticate={(anchor) => authenticate(anchor)}
          // Wait 2 seconds
          sign={() => new Promise((resolve) => setTimeout(resolve, 2000))}
          send={(anchor) => sign(anchor)}
          setOpen={(open) => setAnchorOpen(open)}
        />
      )}
      <Grid
        sx={{
          transition: "all 0.2s ease-in-out",
          mt: 6,
          height: "100%",
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>
            Hello 👋
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={8} mt={!largerThenMd ? 2 : undefined}>
          {loadingDashboard ? (
            <Skeleton.DashboardStats />
          ) : (
            <DashboardStats {...args.dashboardStatsArgs} />
          )}
        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={2}
          mt={!largerThenMd ? 2 : undefined}
          sx={{
            pr: {
              xs: 0,
              md: 0.5,
              lg: 0,
            },
          }}
        >
          <DashboardPriceCharts {...args.dashboardArgs1} />
        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={2}
          mt={!largerThenMd ? 2 : undefined}
          sx={{
            pl: {
              xs: 0,
              md: 0.5,
              lg: 0,
            },
          }}
        >
          <DashboardPriceCharts {...args.dashboardArgs2} />
        </Grid>
        <Grid item xs={12} md={5} lg={4} sx={{ mt: 2 }}>
          <CryptoCTA
            onClick={() =>
              window.open(
                `https://app.kado.money/
?onPayAmount=250
&onPayCurrency=USD
&onRevCurrency=USDC
&cryptoList=XLM,USDC
&network=STELLAR
&networkList=STELLAR
&product=BUY
&productList=BUY` +
                  (persistStore.wallet.address
                    ? `&onToAddress=${persistStore.wallet.address}`
                    : ""),
                "_blank",
                "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=480,height=620"
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8} sx={{ mt: 2 }}>
          {loadingBalances ? (
            <Skeleton.WalletBalanceTable />
          ) : (
            <WalletBalanceTable
              tokens={allTokens}
              activeVesting={Boolean(vestingIndexes.length)}
              onClaimVestedClick={(address: string) => {
                setVestingModalOpen(true);
              }}
              onTokenClick={(token: string) => {
                fetchTokenInfo(token);
              }}
            />
          )}
        </Grid>
      </Grid>
      {selectedTokenForInfo && (
        <AssetInfoModal
          open={tokenInfoOpen}
          onClose={() => setTokenInfoOpen(false)}
          asset={selectedTokenForInfo}
        />
      )}
      <VestedTokensModal
        open={vestingModalOpen}
        onClose={() => setVestingModalOpen(false)}
        vestingInfo={vestingInfo}
        onButtonClick={claimVestedTokens}
        loading={claimTransactionLoading}
      />

      <VestingError
        open={claimErrorModalOpen}
        setOpen={setClaimErrorModalOpen}
        error={claimErrorMessage}
      />

      <VestingSuccess
        open={claimSuccessModalOpen}
        setOpen={setClaimSuccessModalOpen}
        onButtonClick={() => setClaimSuccessModalOpen(false)}
      />
    </Box>
  );
}
