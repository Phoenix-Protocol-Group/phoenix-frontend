import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Avatar,
  Tabs,
  Tab,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AssetInfoModalProps, PoolsFilter } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../Theme/styleConstants";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { CardContainer } from "../../Common/CardContainer";
import { TradingVolume } from "@phoenix-protocol/utils/build/trade_api";
import { PoolItem } from "../../Pools/Pools";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";

// Interface for a tab panel
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

// Define chart data type
interface ChartDataPoint {
  date: string;
  value?: number;
  volume?: number;
}

// Helper function to determine color based on rating
const getRatingColor = (rating: number): string => {
  if (rating >= 4) return colors.success[500];
  if (rating >= 2.5) return colors.warning[500];
  return colors.error[500];
};

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toFixed(1);
};

// Calculate total volume
const calculateTotalVolume = (volumes: TradingVolume[]): number => {
  return volumes.reduce((total, volume) => {
    return total + Number(volume.usdVolume);
  }, 0);
};

// Helper function to shorten addresses
const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
};

// Data transformations for charts
const prepareVolumeChartData = (
  data: TradingVolume[] | undefined
): ChartDataPoint[] => {
  if (!data || !Array.isArray(data)) return [];

  // Map to date and volume minding the date and time object format
  return data.map((item) => {
    const date = item.date
      ? `${item.date.year}-${String(item.date.month).padStart(2, "0")}-${String(
          item.date.day
        ).padStart(2, "0")}`
      : "";

    return {
      date,
      volume: Number(item.usdVolume),
    };
  });
};

// Data transformations for charts
const preparePriceChartData = (
  data: [number, number][] | undefined
): ChartDataPoint[] => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => ({
    date: new Date(item[0]).toLocaleDateString(),
    value: item[1],
  }));
};

// Tab Panel component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-info-tabpanel-${index}`}
      aria-labelledby={`asset-info-tab-${index}`}
      {...other}
      style={{
        width: "100%",
        height: value === index ? "100%" : 0, // Full height when active
        overflow: "auto",
      }}
    >
      {value === index && (
        <Box sx={{ pt: spacing.md, width: "100%", height: "100%" }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AssetInfoModal = ({
  open,
  onClose,
  asset,
  tradingVolume7d,
  userBalance = 0,
  pools = [],
  loading = false,
}: AssetInfoModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Chart data
  const volumeData = prepareVolumeChartData(
    (tradingVolume7d as TradingVolume[]) || []
  );

  const priceData = preparePriceChartData(asset.price7d || []);

  // Modal styles using the app's style constants
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "90%", md: "85%", lg: "75%" },
    maxWidth: "1200px",
    height: { xs: "95vh", md: "85vh" }, // Set explicit height instead of maxHeight
    background: colors.neutral[900],
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    display: "flex",
    flexDirection: "column" as "column",
    overflow: "hidden",
  };

  // Chart height constant to ensure consistency
  const chartHeight = 300;
  const chartCardHeight = 420;

  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: colors.neutral[800],
            border: `1px solid ${colors.neutral[700]}`,
            p: spacing.sm,
            borderRadius: borderRadius.md,
            boxShadow: shadows.tooltip,
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[50],
              mb: 0.5,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            {label}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor:
                  payload[0].dataKey === "value"
                    ? colors.primary.main
                    : colors.success[500],
                borderRadius: "50%",
              }}
            />
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[200],
              }}
            >
              {payload[0].dataKey === "value" ? "Price: " : "Volume: "}
              <Box
                component="span"
                sx={{
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {payload[0].value.toFixed(6)}
              </Box>
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="asset-info-modal"
      aria-describedby="Asset Information Modal"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Box sx={style}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <CircularProgress
                  sx={{
                    color: colors.primary.main,
                    mb: spacing.md,
                  }}
                  size={48}
                />
                <Typography
                  sx={{
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.md,
                    mt: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  Loading asset data...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: spacing.lg,
                    borderBottom: `1px solid ${colors.neutral[800]}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.sm,
                    }}
                  >
                    {asset.tomlInfo.image && (
                      <Avatar
                        src={asset.tomlInfo.image}
                        alt={asset.tomlInfo.code}
                        sx={{ width: 40, height: 40 }}
                      />
                    )}
                    <Box>
                      <Typography
                        sx={{
                          color: colors.neutral[50],
                          fontSize: typography.fontSize.xl,
                          fontWeight: typography.fontWeights.bold,
                          fontFamily: typography.fontFamily,
                          display: "flex",
                          alignItems: "center",
                          gap: spacing.xs,
                        }}
                      >
                        {asset.tomlInfo.code}
                        {asset.domain && (
                          <Tooltip title={`Issuer: ${asset.domain}`}>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: typography.fontSize.sm,
                                color: colors.neutral[400],
                                fontWeight: typography.fontWeights.regular,
                              }}
                            >
                              ({asset.domain})
                            </Typography>
                          </Tooltip>
                        )}
                      </Typography>

                      {userBalance > 0 && (
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.md,
                            color: colors.neutral[300],
                            fontFamily: typography.fontFamily,
                          }}
                        >
                          Your Balance: {formatNumber(userBalance)}{" "}
                          {asset.tomlInfo.code}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <IconButton
                    onClick={onClose}
                    aria-label="close"
                    sx={{
                      color: colors.neutral[400],
                      backgroundColor: colors.neutral[800],
                      "&:hover": {
                        backgroundColor: colors.neutral[700],
                      },
                      width: 36,
                      height: 36,
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content Area */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%", // Use full height
                    overflow: "hidden",
                    flex: 1,
                  }}
                >
                  {/* Tabs */}
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: colors.neutral[800],
                      px: spacing.lg,
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        "& .MuiTab-root": {
                          color: colors.neutral[400],
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeights.medium,
                          textTransform: "none",
                          minWidth: 120,
                        },
                        "& .Mui-selected": {
                          color: colors.neutral[50],
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: colors.primary.main,
                        },
                      }}
                    >
                      <Tab label="Overview" />
                      <Tab label="Charts" />
                      <Tab label="Pools" />
                    </Tabs>
                  </Box>

                  {/* Loading State or Tab Content */}
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        p: spacing.lg,
                        height: "100%",
                      }}
                    >
                      <CircularProgress
                        sx={{
                          color: colors.primary.main,
                          mb: spacing.md,
                        }}
                        size={48}
                      />
                      <Typography
                        sx={{
                          color: colors.neutral[300],
                          fontSize: typography.fontSize.md,
                          mt: spacing.sm,
                          textAlign: "center",
                        }}
                      >
                        Loading asset data...
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        overflow: "auto",
                        flex: 1,
                        p: spacing.lg,
                        height: "100%", // Take full remaining height
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: colors.primary.main,
                          borderRadius: borderRadius.sm,
                        },
                      }}
                    >
                      {/* Tab content with scrollable area */}
                      {/* Overview Tab */}

                      <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3} sx={{ minHeight: "100%" }}>
                          {/* Key metrics */}
                          <Grid item xs={12}>
                            <CardContainer sx={{ height: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: spacing.md,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: colors.neutral[50],
                                    fontSize: typography.fontSize.lg,
                                    fontWeight: typography.fontWeights.medium,
                                    fontFamily: typography.fontFamily,
                                  }}
                                >
                                  Key Metrics
                                </Typography>
                                <Typography
                                  component="a"
                                  href="https://stellar.expert"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    fontSize: typography.fontSize.xs,
                                    color: colors.neutral[400],
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: spacing.xs,
                                    "&:hover": {
                                      color: colors.primary.main,
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  Powered by stellar.expert
                                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                                </Typography>
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Box sx={{ mb: spacing.md }}>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.xs,
                                        color: colors.neutral[400],
                                        mb: spacing.xs,
                                      }}
                                    >
                                      Total Supply
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.md,
                                        fontWeight:
                                          typography.fontWeights.medium,
                                        color: colors.neutral[50],
                                      }}
                                    >
                                      {asset.supply
                                        ? formatNumber(
                                            Number(asset.supply) / 10 ** 7
                                          )
                                        : "N/A"}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box sx={{ mb: spacing.md }}>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.xs,
                                        color: colors.neutral[400],
                                        mb: spacing.xs,
                                      }}
                                    >
                                      Total Payments
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.md,
                                        fontWeight:
                                          typography.fontWeights.medium,
                                        color: colors.neutral[50],
                                      }}
                                    >
                                      {formatNumber(asset.payments)}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box sx={{ mb: spacing.md }}>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.xs,
                                        color: colors.neutral[400],
                                        mb: spacing.xs,
                                      }}
                                    >
                                      Trustlines
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.md,
                                        fontWeight:
                                          typography.fontWeights.medium,
                                        color: colors.neutral[50],
                                      }}
                                    >
                                      {asset.trustlines[2]} funded /{" "}
                                      {asset.trustlines[0]} total
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box sx={{ mb: spacing.md }}>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.xs,
                                        color: colors.neutral[400],
                                        mb: spacing.xs,
                                      }}
                                    >
                                      First Transaction
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.md,
                                        fontWeight:
                                          typography.fontWeights.medium,
                                        color: colors.neutral[50],
                                      }}
                                    >
                                      {new Date(
                                        asset.created * 1000
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={12}>
                                  <Box sx={{ mb: spacing.md }}>
                                    <Typography
                                      sx={{
                                        fontSize: typography.fontSize.xs,
                                        color: colors.neutral[400],
                                        mb: spacing.xs,
                                      }}
                                    >
                                      Issuer
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        bgcolor: colors.neutral[800],
                                        borderRadius: borderRadius.sm,
                                        p: spacing.sm,
                                        maxWidth: "fit-content",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: typography.fontSize.sm,
                                          color: colors.neutral[300],
                                          fontFamily: "monospace",
                                        }}
                                      >
                                        {shortenAddress(asset.tomlInfo.issuer)}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleCopyToClipboard(
                                            asset.tomlInfo.issuer
                                          )
                                        }
                                        sx={{ color: colors.neutral[400] }}
                                      >
                                        <ContentCopyIcon
                                          sx={{ fontSize: 16 }}
                                        />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        component="a"
                                        href={`https://stellar.expert/explorer/public/account/${asset.tomlInfo.issuer}`}
                                        target="_blank"
                                        sx={{ color: colors.neutral[400] }}
                                      >
                                        <OpenInNewIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContainer>
                          </Grid>
                          {/* Asset Rating section has been removed */}
                        </Grid>
                      </TabPanel>

                      {/* Charts Tab */}
                      <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={3}>
                          {/* Price Chart */}
                          <Grid item xs={12} md={6}>
                            <CardContainer sx={{ height: chartCardHeight }}>
                              <Typography
                                sx={{
                                  color: colors.neutral[50],
                                  fontSize: typography.fontSize.lg,
                                  fontWeight: typography.fontWeights.medium,
                                  fontFamily: typography.fontFamily,
                                  mb: spacing.md,
                                }}
                              >
                                Price (USDC) - 7 Days
                              </Typography>

                              {volumeData.length > 0 ? (
                                <Box
                                  sx={{ height: chartHeight, mt: spacing.md }}
                                >
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <AreaChart
                                      data={priceData}
                                      margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                      }}
                                    >
                                      <defs>
                                        <linearGradient
                                          id="colorPrice"
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop
                                            offset="5%"
                                            stopColor={colors.primary.main}
                                            stopOpacity={0.8}
                                          />
                                          <stop
                                            offset="95%"
                                            stopColor={colors.primary.main}
                                            stopOpacity={0}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <XAxis
                                        dataKey="date"
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 12,
                                        }}
                                        axisLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                        tickLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                      />
                                      <YAxis
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 12,
                                        }}
                                        axisLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                        tickLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                      />
                                      <RechartsTooltip
                                        content={<CustomTooltip />}
                                        cursor={{
                                          stroke: colors.neutral[600],
                                          strokeDasharray: "3 3",
                                        }}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={colors.primary.main}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: chartHeight,
                                    border: `1px dashed ${colors.neutral[700]}`,
                                    borderRadius: borderRadius.md,
                                  }}
                                >
                                  <Typography
                                    sx={{ color: colors.neutral[400] }}
                                  >
                                    No price data available
                                  </Typography>
                                </Box>
                              )}
                            </CardContainer>
                          </Grid>

                          {/* Volume Chart */}
                          <Grid item xs={12} md={6}>
                            <CardContainer sx={{ height: chartCardHeight }}>
                              <Typography
                                sx={{
                                  color: colors.neutral[50],
                                  fontSize: typography.fontSize.lg,
                                  fontWeight: typography.fontWeights.medium,
                                  fontFamily: typography.fontFamily,
                                  mb: spacing.md,
                                }}
                              >
                                Volume - 7 Days
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  mb: spacing.sm,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: typography.fontSize.sm,
                                    color: colors.neutral[400],
                                  }}
                                >
                                  Total Volume (7d):
                                  {formatNumber(
                                    // @ts-ignore
                                    calculateTotalVolume(tradingVolume7d)
                                  )}{" "}
                                  USDC
                                </Typography>
                              </Box>

                              {volumeData.length > 0 ? (
                                <Box
                                  sx={{ height: chartHeight, mt: spacing.md }}
                                >
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <BarChart
                                      data={volumeData}
                                      margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                      }}
                                    >
                                      <defs>
                                        <linearGradient
                                          id="colorVolume"
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop
                                            offset="0%"
                                            stopColor={colors.primary.main}
                                            stopOpacity={0.9}
                                          />
                                          <stop
                                            offset="100%"
                                            stopColor={colors.primary.gradient}
                                            stopOpacity={0.8}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <XAxis
                                        dataKey="date"
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 12,
                                        }}
                                        axisLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                        tickLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                      />
                                      <YAxis
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 12,
                                        }}
                                        axisLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                        tickLine={{
                                          stroke: colors.neutral[700],
                                        }}
                                      />
                                      <RechartsTooltip
                                        content={<CustomTooltip />}
                                        cursor={{
                                          fill: colors.neutral[800],
                                          opacity: 0.3,
                                        }}
                                      />
                                      <Bar
                                        dataKey="volume"
                                        fill="url(#colorVolume)"
                                        radius={[4, 4, 0, 0]}
                                      />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: chartHeight,
                                    border: `1px dashed ${colors.neutral[700]}`,
                                    borderRadius: borderRadius.md,
                                  }}
                                >
                                  <Typography
                                    sx={{ color: colors.neutral[400] }}
                                  >
                                    No volume data available
                                  </Typography>
                                </Box>
                              )}
                            </CardContainer>
                          </Grid>
                        </Grid>
                      </TabPanel>

                      {/* Pools Tab */}
                      <TabPanel value={tabValue} index={2}>
                        {pools.length > 0 ? (
                          <Grid container spacing={3}>
                            {pools.map((pool) => (
                              <PoolItem
                                pool={{
                                  ...pool,
                                  tvl: formatCurrencyStatic.format(
                                    Number(pool.tvl)
                                  ),
                                  maxApr: `${pool.maxApr}%`,
                                }}
                                filter={{} as PoolsFilter}
                                onShowDetailsClick={() => {
                                  window.location.href = `/pools/${pool.poolAddress}`;
                                }}
                                onAddLiquidityClick={() => {}}
                              />
                            ))}
                          </Grid>
                        ) : (
                          <CardContainer>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: spacing.md,
                              }}
                            >
                              <Box
                                component="img"
                                src="/icons/liquidity.svg"
                                alt="No pools"
                                sx={{
                                  width: 80,
                                  height: 80,
                                  opacity: 0.5,
                                  mb: spacing.md,
                                }}
                              />
                              <Typography
                                sx={{
                                  color: colors.neutral[400],
                                  fontSize: typography.fontSize.md,
                                  textAlign: "center",
                                }}
                              >
                                No liquidity pools available for this asset
                              </Typography>
                            </Box>
                          </CardContainer>
                        )}
                      </TabPanel>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    </MuiModal>
  );
};

export { AssetInfoModal };
