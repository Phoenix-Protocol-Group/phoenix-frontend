import React, { useState, useCallback, useEffect } from "react";
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
        flex: value === index ? 1 : 0,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {value === index && (
        <Box sx={{ width: "100%", height: "100%", flex: 1 }}>{children}</Box>
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
  const [error, setError] = useState<string | null>(null);

  // Reset tab and error when modal opens
  useEffect(() => {
    if (open) {
      setTabValue(0);
      setError(null);
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleClose = useCallback(() => {
    setTabValue(0);
    setError(null);
    onClose();
  }, [onClose]);

  // Error handling for data validation
  useEffect(() => {
    if (open && asset) {
      try {
        // Validate required asset data
        if (!asset.tomlInfo) {
          setError("Asset information is incomplete");
          return;
        }
        setError(null);
      } catch (err) {
        setError("Failed to load asset data");
      }
    }
  }, [open, asset]);

  // Chart data
  const volumeData = prepareVolumeChartData(
    (tradingVolume7d as TradingVolume[]) || []
  );

  const priceData = preparePriceChartData(asset.price7d || []);

  // Enhanced modal styles with better glassmorphism and backdrop
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95vw", sm: "90vw", md: "80vw", lg: "70vw" },
    maxWidth: "1200px",
    height: { xs: "90vh", md: "85vh", lg: "80vh" },
    maxHeight: "900px",
    minHeight: "600px",
    background:
      "linear-gradient(135deg, rgba(23, 23, 23, 0.97) 0%, rgba(38, 38, 38, 0.95) 50%, rgba(23, 23, 23, 0.97) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid rgba(115, 115, 115, 0.2)`,
    borderRadius: borderRadius.xl,
    boxShadow:
      "0 32px 64px -12px rgba(0, 0, 0, 0.8), 0 20px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column" as "column",
    overflow: "hidden",
    outline: "none",
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
      onClose={handleClose}
      aria-labelledby="asset-info-modal-title"
      aria-describedby="asset-info-modal-description"
      keepMounted={false}
      disableScrollLock
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      BackdropProps={{
        sx: {
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={style}>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      background:
                        "linear-gradient(135deg, rgba(115, 115, 115, 0.02) 0%, rgba(148, 163, 184, 0.01) 100%)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <CircularProgress
                        sx={{
                          color: colors.primary.main,
                          mb: spacing.md,
                          filter:
                            "drop-shadow(0 4px 8px rgba(249, 115, 22, 0.2))",
                        }}
                        size={48}
                        thickness={3}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Typography
                        sx={{
                          color: colors.neutral[300],
                          fontSize: typography.fontSize.md,
                          mt: spacing.sm,
                          textAlign: "center",
                          fontWeight: typography.fontWeights.medium,
                        }}
                      >
                        Loading asset data...
                      </Typography>
                    </motion.div>
                  </Box>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      p: spacing.xl,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: spacing.lg,
                        border: `2px solid rgba(239, 68, 68, 0.2)`,
                      }}
                    >
                      <Typography sx={{ fontSize: "32px" }}>⚠️</Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: colors.error.main,
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeights.semiBold,
                        mb: spacing.sm,
                        textAlign: "center",
                      }}
                    >
                      Unable to Load Asset
                    </Typography>
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.sm,
                        textAlign: "center",
                        maxWidth: 300,
                        lineHeight: 1.6,
                      }}
                    >
                      {error}
                    </Typography>
                  </Box>
                </motion.div>
              ) : (
                <>
                  {/* Enhanced Header with premium styling */}
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(115, 115, 115, 0.08) 0%, rgba(148, 163, 184, 0.04) 50%, rgba(249, 115, 22, 0.02) 100%)",
                      borderBottom: `1px solid ${colors.neutral[700]}`,
                      p: spacing.lg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.3) 50%, transparent 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: spacing.md,
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          asset.tomlInfo?.image || "/cryptoIcons/default.svg"
                        }
                        alt={`${asset.tomlInfo?.code || "Asset"} icon`}
                        sx={{
                          width: isMobile ? 40 : 48,
                          height: isMobile ? 40 : 48,
                          borderRadius: "50%",
                          border: `2px solid ${colors.neutral[600]}`,
                        }}
                      />
                      <Box>
                        <Typography
                          id="asset-info-modal-title"
                          sx={{
                            color: colors.neutral[50],
                            fontSize: typography.fontSize.xl,
                            fontWeight: typography.fontWeights.bold,
                            fontFamily: typography.fontFamily,
                          }}
                        >
                          {asset.tomlInfo?.orgName ||
                            asset.tomlInfo?.code ||
                            "Unknown Asset"}
                        </Typography>
                        <Typography
                          id="asset-info-modal-description"
                          sx={{
                            color: colors.neutral[400],
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeights.medium,
                          }}
                        >
                          {asset.tomlInfo?.code || "N/A"} • Asset Information
                        </Typography>
                      </Box>
                    </Box>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <IconButton
                        onClick={handleClose}
                        aria-label="Close asset information modal"
                        sx={{
                          background: "rgba(239, 68, 68, 0.1)",
                          color: colors.neutral[300],
                          width: 40,
                          height: 40,
                          border: `1px solid rgba(239, 68, 68, 0.2)`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background: "rgba(239, 68, 68, 0.2)",
                            color: colors.error.main,
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
                          },
                          "&:focus": {
                            outline: `2px solid ${colors.primary.main}`,
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </motion.div>
                  </Box>

                  {/* Enhanced Tabs with gradient indicators */}
                  <Box
                    sx={{
                      borderBottom: `1px solid ${colors.neutral[700]}`,
                      background:
                        "linear-gradient(135deg, rgba(115, 115, 115, 0.03) 0%, rgba(148, 163, 184, 0.02) 100%)",
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="asset info tabs"
                      sx={{
                        minHeight: 48,
                        "& .MuiTabs-flexContainer": {
                          borderBottom: "none",
                        },
                        "& .MuiTabs-indicator": {
                          background:
                            "linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)",
                          height: 3,
                          borderRadius: "3px 3px 0 0",
                          boxShadow: "0 2px 8px rgba(249, 115, 22, 0.3)",
                        },
                        "& .MuiTab-root": {
                          color: colors.neutral[400],
                          fontWeight: typography.fontWeights.medium,
                          fontSize: typography.fontSize.sm,
                          textTransform: "none",
                          minHeight: 48,
                          position: "relative",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&.Mui-selected": {
                            color: colors.primary.main,
                            fontWeight: typography.fontWeights.semiBold,
                            background:
                              "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.02) 100%)",
                          },
                          "&:hover": {
                            color: colors.neutral[200],
                            background: "rgba(115, 115, 115, 0.05)",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 50%, rgba(249, 115, 22, 0.1) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          },
                          "&.Mui-selected::before": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Tab label="Overview" />
                      <Tab label="Charts" />
                      <Tab label="Pools" />
                    </Tabs>
                  </Box>

                  {/* Content Area */}
                  <Box
                    sx={{
                      overflow: "auto",
                      flex: 1,
                      p: { xs: spacing.md, md: spacing.lg },
                      minHeight: 0, // Important for flex child to shrink
                      display: "flex",
                      flexDirection: "column",
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
                              <motion.div
                                whileHover={{
                                  scale: 1.02,
                                  y: -2,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                              >
                                <Box
                                  sx={{
                                    p: spacing.md,
                                    borderRadius: borderRadius.lg,
                                    background:
                                      "linear-gradient(135deg, rgba(115, 115, 115, 0.05) 0%, rgba(148, 163, 184, 0.02) 100%)",
                                    border: `1px solid ${colors.neutral[700]}`,
                                    textAlign: "center",
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    position: "relative",
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      borderColor: colors.primary.main,
                                      boxShadow:
                                        "0 8px 25px rgba(249, 115, 22, 0.15)",
                                    },
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: 2,
                                      background:
                                        "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.6) 50%, transparent 100%)",
                                      borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
                                      opacity: 0,
                                      transition: "opacity 0.3s ease",
                                    },
                                    "&:hover::before": {
                                      opacity: 1,
                                    },
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
                              </motion.div>
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
                                  {asset.trustlines[2]} / {asset.trustlines[0]}
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
                                    handleCopyToClipboard(asset.tomlInfo.issuer)
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
                                <ResponsiveContainer width="100%" height="100%">
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
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: chartHeight,
                                    border: `1px dashed ${colors.neutral[700]}`,
                                    borderRadius: borderRadius.md,
                                    background:
                                      "linear-gradient(135deg, rgba(115, 115, 115, 0.02) 0%, rgba(148, 163, 184, 0.01) 100%)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: colors.neutral[400],
                                      fontSize: typography.fontSize.sm,
                                      mb: spacing.xs,
                                    }}
                                  >
                                    📈
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: colors.neutral[400],
                                      fontSize: typography.fontSize.sm,
                                      fontWeight: typography.fontWeights.medium,
                                    }}
                                  >
                                    No price data available
                                  </Typography>
                                </Box>
                              </motion.div>
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
                                <ResponsiveContainer width="100%" height="100%">
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
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: chartHeight,
                                    border: `1px dashed ${colors.neutral[700]}`,
                                    borderRadius: borderRadius.md,
                                    background:
                                      "linear-gradient(135deg, rgba(115, 115, 115, 0.02) 0%, rgba(148, 163, 184, 0.01) 100%)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: colors.neutral[400],
                                      fontSize: typography.fontSize.sm,
                                      mb: spacing.xs,
                                    }}
                                  >
                                    📊
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: colors.neutral[400],
                                      fontSize: typography.fontSize.sm,
                                      fontWeight: typography.fontWeights.medium,
                                    }}
                                  >
                                    No volume data available
                                  </Typography>
                                </Box>
                              </motion.div>
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
                            <Box
                              key={pool.poolAddress || index}
                              sx={{
                                width: { xs: "100%", sm: "50%" }, // Force 50% width on sm+
                                padding: spacing.sm,
                                "& .MuiGrid-item": {
                                  // Override the PoolItem's internal grid sizing
                                  width: "100% !important",
                                  flexBasis: "100% !important",
                                  maxWidth: "100% !important",
                                },
                              }}
                            >
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
                            </Box>
                          ))}
                        </Grid>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              p: spacing.xl,
                              borderRadius: borderRadius.lg,
                              background:
                                "linear-gradient(135deg, rgba(115, 115, 115, 0.05) 0%, rgba(148, 163, 184, 0.02) 100%)",
                              border: `1px dashed ${colors.neutral[700]}`,
                              textAlign: "center",
                              position: "relative",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: -1,
                                left: -1,
                                right: -1,
                                bottom: -1,
                                background:
                                  "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 50%, rgba(249, 115, 22, 0.1) 100%)",
                                borderRadius: borderRadius.lg,
                                zIndex: -1,
                                opacity: 0.3,
                              },
                            }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, rgba(115, 115, 115, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mb: spacing.lg,
                                  border: `2px solid ${colors.neutral[700]}`,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "32px",
                                    filter: "grayscale(0.3)",
                                  }}
                                >
                                  💧
                                </Typography>
                              </Box>
                            </motion.div>
                            <Typography
                              sx={{
                                color: colors.neutral[300],
                                fontSize: typography.fontSize.lg,
                                fontWeight: typography.fontWeights.semiBold,
                                mb: spacing.sm,
                              }}
                            >
                              No Liquidity Pools
                            </Typography>
                            <Typography
                              sx={{
                                color: colors.neutral[400],
                                fontSize: typography.fontSize.sm,
                                maxWidth: 320,
                                lineHeight: 1.6,
                                mb: spacing.md,
                              }}
                            >
                              No liquidity pools are currently available for
                              this asset. Check back later or explore other
                              assets to find trading opportunities.
                            </Typography>
                            <Box
                              sx={{
                                px: spacing.md,
                                py: spacing.sm,
                                borderRadius: borderRadius.sm,
                                background: "rgba(249, 115, 22, 0.1)",
                                border: `1px solid rgba(249, 115, 22, 0.2)`,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: colors.primary.main,
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeights.medium,
                                }}
                              >
                                💡 Tip: Pool availability depends on market
                                demand
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      )}
                    </TabPanel>
                  </Box>
                </>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </MuiModal>
  );
};

export { AssetInfoModal };
