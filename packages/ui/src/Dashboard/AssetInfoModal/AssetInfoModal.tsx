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
  if (rating >= 4) return colors.success.main;
  if (rating >= 2.5) return colors.warning.main;
  return colors.error.main;
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
        height: value === index ? "100%" : 0,
        overflow: "auto",
      }}
    >
      {value === index && (
        <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>
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

  // Modal styles using the app's style constants - consistent with CardContainer
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
    maxWidth: "1000px",
    height: { xs: "90vh", md: "80vh", lg: "75vh" },
    background: colors.neutral[900],
    border: `1px solid ${colors.neutral[700]}`,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    display: "flex",
    flexDirection: "column" as "column",
    overflow: "hidden",
  };

  // Chart height constant to ensure consistency - reduced for better space utilization
  const chartHeight = 240;
  const chartCardHeight = 300;

  // Custom tooltip component for better styling - simplified
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: colors.neutral[900],
            border: `1px solid ${colors.neutral[700]}`,
            p: spacing.md,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.card,
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[50],
              mb: spacing.xs,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            {label}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                background:
                  payload[0].dataKey === "value"
                    ? "#F97316"
                    : colors.success.main,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[900]}`,
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
                  fontWeight: typography.fontWeights.bold,
                }}
              >
                {payload[0].dataKey === "value"
                  ? `$${payload[0].value.toFixed(6)}`
                  : `${formatNumber(payload[0].value)} USDC`}
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
                    padding: { xs: spacing.md, md: spacing.lg },
                    borderBottom: `1px solid ${colors.neutral[800]}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.md,
                    }}
                  >
                    {asset.tomlInfo.image && (
                      <Avatar
                        src={asset.tomlInfo.image}
                        alt={asset.tomlInfo.code}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${colors.neutral[700]}`,
                        }}
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
                          mb: spacing.xs,
                        }}
                      >
                        {asset.tomlInfo.code}
                        {asset.domain && (
                          <Tooltip title={`Issuer: ${asset.domain}`}>
                            <Box
                              sx={{
                                px: spacing.xs,
                                py: 2,
                                borderRadius: borderRadius.sm,
                                background: colors.neutral[800],
                                border: `1px solid ${colors.neutral[700]}`,
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: typography.fontSize.xs,
                                  color: colors.primary.main,
                                  fontWeight: typography.fontWeights.medium,
                                }}
                              >
                                {asset.domain}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Typography>

                      {userBalance > 0 && (
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral[300],
                            fontFamily: typography.fontFamily,
                            display: "flex",
                            alignItems: "center",
                            gap: spacing.xs,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: colors.success.main,
                            }}
                          />
                          Balance: {formatNumber(userBalance)}{" "}
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
                      border: `1px solid ${colors.neutral[700]}`,
                      "&:hover": {
                        backgroundColor: colors.neutral[700],
                        borderColor: colors.neutral[600],
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                      width: 40,
                      height: 40,
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
                      px: { xs: spacing.md, md: spacing.lg },
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        minHeight: 48,
                        "& .MuiTab-root": {
                          color: colors.neutral[400],
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeights.medium,
                          textTransform: "none",
                          minWidth: 100,
                          px: spacing.md,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            color: colors.neutral[200],
                            background: `${colors.neutral[800]}40`,
                          },
                        },
                        "& .Mui-selected": {
                          color: colors.neutral[50],
                          background: colors.neutral[800],
                          borderRadius: `${borderRadius.md}px ${borderRadius.md}px 0 0`,
                        },
                        "& .MuiTabs-indicator": {
                          height: 3,
                          borderRadius: borderRadius.sm,
                          background: colors.primary.main,
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
                        p: { xs: spacing.md, md: spacing.lg },
                        height: "100%",
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: colors.neutral[800],
                          borderRadius: borderRadius.sm,
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: colors.primary.main,
                          borderRadius: borderRadius.sm,
                          "&:hover": {
                            background: colors.primary.main,
                          },
                        },
                      }}
                    >
                      {/* Tab content with scrollable area */}
                      {/* Overview Tab */}

                      <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={2}>
                          {/* Quick Stats Row */}
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={3}>
                                <Box
                                  sx={{
                                    p: spacing.md,
                                    borderRadius: borderRadius.lg,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.neutral[700]}`,
                                    textAlign: "center",
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.neutral[400],
                                      mb: spacing.xs,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Total Supply
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.lg,
                                      fontWeight: typography.fontWeights.bold,
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

                              <Grid item xs={6} md={3}>
                                <Box
                                  sx={{
                                    p: spacing.md,
                                    borderRadius: borderRadius.lg,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.neutral[700]}`,
                                    textAlign: "center",
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.neutral[400],
                                      mb: spacing.xs,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Payments
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.lg,
                                      fontWeight: typography.fontWeights.bold,
                                      color: colors.neutral[50],
                                    }}
                                  >
                                    {formatNumber(asset.payments)}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={6} md={3}>
                                <Box
                                  sx={{
                                    p: spacing.md,
                                    borderRadius: borderRadius.lg,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.neutral[700]}`,
                                    textAlign: "center",
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.neutral[400],
                                      mb: spacing.xs,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Trustlines
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.md,
                                      fontWeight: typography.fontWeights.bold,
                                      color: colors.neutral[50],
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {asset.trustlines[2]} /{" "}
                                    {asset.trustlines[0]}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.neutral[400],
                                      mt: spacing.xs,
                                    }}
                                  >
                                    funded / total
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={6} md={3}>
                                <Box
                                  sx={{
                                    p: spacing.md,
                                    borderRadius: borderRadius.lg,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.neutral[700]}`,
                                    textAlign: "center",
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.neutral[400],
                                      mb: spacing.xs,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Created
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.sm,
                                      fontWeight: typography.fontWeights.bold,
                                      color: colors.neutral[50],
                                    }}
                                  >
                                    {new Date(
                                      asset.created * 1000
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* Issuer Information */}
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                p: spacing.lg,
                                borderRadius: borderRadius.lg,
                                background: colors.neutral[800],
                                border: `1px solid ${colors.neutral[700]}`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
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
                                  Issuer Information
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
                                    px: spacing.sm,
                                    py: spacing.xs,
                                    borderRadius: borderRadius.sm,
                                    border: `1px solid ${colors.neutral[700]}`,
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                      color: colors.primary.main,
                                      borderColor: colors.primary.main,
                                      background: `${colors.primary.main}10`,
                                    },
                                  }}
                                >
                                  stellar.expert
                                  <OpenInNewIcon sx={{ fontSize: 12 }} />
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: spacing.md,
                                  p: spacing.md,
                                  bg: colors.neutral[800],
                                  borderRadius: borderRadius.md,
                                  border: `1px solid ${colors.neutral[700]}`,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: typography.fontSize.sm,
                                    color: colors.neutral[300],
                                    fontFamily: "monospace",
                                    flex: 1,
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {asset.tomlInfo.issuer}
                                </Typography>
                                <Box sx={{ display: "flex", gap: spacing.xs }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleCopyToClipboard(
                                        asset.tomlInfo.issuer
                                      )
                                    }
                                    sx={{
                                      color: colors.neutral[400],
                                      "&:hover": {
                                        color: colors.primary.main,
                                        background: `${colors.primary.main}20`,
                                      },
                                      transition: "all 0.2s ease-in-out",
                                    }}
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    component="a"
                                    href={`https://stellar.expert/explorer/public/account/${asset.tomlInfo.issuer}`}
                                    target="_blank"
                                    sx={{
                                      color: colors.neutral[400],
                                      "&:hover": {
                                        color: colors.primary.main,
                                        background: `${colors.primary.main}20`,
                                      },
                                      transition: "all 0.2s ease-in-out",
                                    }}
                                  >
                                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </TabPanel>

                      {/* Charts Tab */}
                      <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={2}>
                          {/* Price Chart */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                height: chartCardHeight,
                                p: spacing.lg,
                                borderRadius: borderRadius.lg,
                                background: colors.neutral[800],
                                border: `1px solid ${colors.neutral[700]}`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
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
                                  Price (USDC) - 7 Days
                                </Typography>
                                <Box
                                  sx={{
                                    px: spacing.sm,
                                    py: spacing.xs,
                                    borderRadius: borderRadius.sm,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.primary.main}`,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.primary.main,
                                      fontWeight: typography.fontWeights.medium,
                                    }}
                                  >
                                    7D
                                  </Typography>
                                </Box>
                              </Box>

                              {priceData.length > 0 ? (
                                <Box sx={{ height: chartHeight }}>
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <AreaChart
                                      data={priceData}
                                      margin={{
                                        top: 10,
                                        right: 20,
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
                                            stopColor="#F97316"
                                            stopOpacity={0.8}
                                          />
                                          <stop
                                            offset="95%"
                                            stopColor="#F97316"
                                            stopOpacity={0.1}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <XAxis
                                        dataKey="date"
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 11,
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
                                          fontSize: 11,
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
                                        stroke="#F97316"
                                        strokeWidth={2}
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
                                    background: `${colors.neutral[800]}20`,
                                  }}
                                >
                                  <Typography
                                    sx={{ color: colors.neutral[400] }}
                                  >
                                    No price data available
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>

                          {/* Volume Chart */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                height: chartCardHeight,
                                p: spacing.lg,
                                borderRadius: borderRadius.lg,
                                background: colors.neutral[800],
                                border: `1px solid ${colors.neutral[700]}`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: spacing.sm,
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
                                  Volume - 7 Days
                                </Typography>
                                <Box
                                  sx={{
                                    px: spacing.sm,
                                    py: spacing.xs,
                                    borderRadius: borderRadius.sm,
                                    background: colors.neutral[800],
                                    border: `1px solid ${colors.success.main}`,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: typography.fontSize.xs,
                                      color: colors.success.main,
                                      fontWeight: typography.fontWeights.medium,
                                    }}
                                  >
                                    Total:{" "}
                                    {formatNumber(
                                      calculateTotalVolume(
                                        tradingVolume7d as TradingVolume[]
                                      )
                                    )}{" "}
                                    USDC
                                  </Typography>
                                </Box>
                              </Box>

                              {volumeData.length > 0 ? (
                                <Box sx={{ height: chartHeight }}>
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <BarChart
                                      data={volumeData}
                                      margin={{
                                        top: 10,
                                        right: 20,
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
                                            stopColor={colors.success.main}
                                            stopOpacity={0.9}
                                          />
                                          <stop
                                            offset="100%"
                                            stopColor={colors.success.main}
                                            stopOpacity={0.3}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <XAxis
                                        dataKey="date"
                                        tick={{
                                          fill: colors.neutral[400],
                                          fontSize: 11,
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
                                          fontSize: 11,
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
                                    background: `${colors.neutral[800]}20`,
                                  }}
                                >
                                  <Typography
                                    sx={{ color: colors.neutral[400] }}
                                  >
                                    No volume data available
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </TabPanel>

                      {/* Pools Tab */}
                      <TabPanel value={tabValue} index={2}>
                        {pools.length > 0 ? (
                          <Grid container spacing={2}>
                            {pools.map((pool, index) => (
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
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              p: spacing.xl,
                              borderRadius: borderRadius.lg,
                              background: colors.neutral[800],
                              border: `1px dashed ${colors.neutral[700]}`,
                              textAlign: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: colors.neutral[700],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: spacing.lg,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "32px",
                                  color: colors.neutral[500],
                                }}
                              >
                                💧
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                color: colors.neutral[300],
                                fontSize: typography.fontSize.lg,
                                fontWeight: typography.fontWeights.medium,
                                mb: spacing.sm,
                              }}
                            >
                              No Liquidity Pools
                            </Typography>
                            <Typography
                              sx={{
                                color: colors.neutral[400],
                                fontSize: typography.fontSize.sm,
                                maxWidth: 300,
                                lineHeight: 1.5,
                              }}
                            >
                              No liquidity pools are currently available for
                              this asset. Check back later or explore other
                              assets.
                            </Typography>
                          </Box>
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
