import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { TokenBox } from "../../Swap";
import { Button } from "../../Button/Button";
import { LabTabProps, PoolLiquidityProps } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import { borderRadius, colors, typography } from "../../Theme/styleConstants";

/**
 * GlowingChart Component
 */
const GlowingChart = ({ data }: { data: number[][] }) => (
  <Box sx={{ position: "relative", width: "100%", marginTop: "-1rem" }}>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <filter id="neonGlow" x="-100%" y="-100%" width="200%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#64748B" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#64748B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <YAxis
          hide
          dataKey={(v) => v[1]}
          domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
        />
        <Area
          type="monotone"
          dataKey={(v) => v[1]}
          stroke="#64748B"
          strokeWidth={2}
          filter="url(#neonGlow)"
          fill="url(#chartFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
);

/**
 * LabTabs Component
 */
const LabTabs = ({
  tokenA,
  tokenB,
  liquidityA,
  liquidityB,
  liquidityToken,
  onAddLiquidity,
  onRemoveLiquidity,
}: LabTabProps) => {
  const [value, setValue] = useState("1");
  const [tokenAValue, setTokenAValue] = useState<string | undefined>(undefined);
  const [tokenBValue, setTokenBValue] = useState<string | undefined>(undefined);
  const [tokenCValue, setTokenCValue] = useState<string | undefined>(undefined);

  const liquidityRatio = useMemo(
    () => liquidityA / liquidityB,
    [liquidityA, liquidityB]
  );

  const keepRatioA = useCallback(
    (val: string) => {
      setTokenAValue(val);
      setTokenBValue((Number(val) / liquidityRatio).toFixed(4));
    },
    [liquidityRatio]
  );

  const keepRatioB = useCallback(
    (val: string) => {
      setTokenBValue(val);
      setTokenAValue((Number(val) * liquidityRatio).toFixed(4));
    },
    [liquidityRatio]
  );

  const buttonStyles = {
    flex: 1,
    maxWidth: "200px",
    color: "#FFFFFF",
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "Ubuntu, sans-serif",
    py: 1.5,
    px: 3,
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        mt: 3,
        position: "relative",
        zIndex: 1,
      }}
    >
      <TabContext value={value}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MuiButton
              onClick={() => setValue("1")}
              sx={{
                ...buttonStyles,
                background:
                  value === "1"
                    ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                    : "rgba(249, 115, 22, 0.1)",
                border:
                  value === "1"
                    ? "1px solid rgba(249, 115, 22, 0.3)"
                    : "1px solid rgba(249, 115, 22, 0.2)",
                boxShadow:
                  value === "1"
                    ? "0 8px 32px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.2)"
                    : "none",
                "&:hover": {
                  background:
                    value === "1"
                      ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                      : "rgba(249, 115, 22, 0.15)",
                  border: "1px solid rgba(249, 115, 22, 0.4)",
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.2)",
                },
              }}
            >
              Add Liquidity
            </MuiButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MuiButton
              onClick={() => setValue("2")}
              sx={{
                ...buttonStyles,
                background:
                  value === "2"
                    ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                    : "rgba(249, 115, 22, 0.1)",
                border:
                  value === "2"
                    ? "1px solid rgba(249, 115, 22, 0.3)"
                    : "1px solid rgba(249, 115, 22, 0.2)",
                boxShadow:
                  value === "2"
                    ? "0 8px 32px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.2)"
                    : "none",
                "&:hover": {
                  background:
                    value === "2"
                      ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                      : "rgba(249, 115, 22, 0.15)",
                  border: "1px solid rgba(249, 115, 22, 0.4)",
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.2)",
                },
              }}
            >
              Remove Liquidity
            </MuiButton>
          </motion.div>
        </Box>
        <TabPanel value="1" sx={{ p: 0, mt: 3 }}>
          <Box>
            <TokenBox
              value={tokenAValue}
              onChange={(val) => keepRatioA(val)}
              token={tokenA}
              hideDropdownButton
            />
          </Box>
          <Box mt={2}>
            <TokenBox
              value={tokenBValue}
              onChange={(val) => keepRatioB(val)}
              token={tokenB}
              hideDropdownButton
            />
          </Box>
          <Button
            onClick={() =>
              onAddLiquidity(Number(tokenAValue), Number(tokenBValue))
            }
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Liquidity
          </Button>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0, mt: 3 }}>
          <Box>
            <TokenBox
              value={tokenCValue}
              onChange={(val) => setTokenCValue(val)}
              token={liquidityToken}
              hideDropdownButton
            />
          </Box>
          <Button
            onClick={() => onRemoveLiquidity(Number(tokenCValue))}
            fullWidth
            sx={{ mt: 3 }}
          >
            Remove Liquidity
          </Button>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

/**
 * PoolLiquidity Component
 */
const PoolLiquidity = ({
  tokenA,
  tokenB,
  liquidityA,
  liquidityB,
  liquidityToken,
  poolHistory,
  onAddLiquidity,
  onRemoveLiquidity,
}: PoolLiquidityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "24px",
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          p: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(${colors.neutral[600].slice(
              1
            )}, 0.4), transparent)`,
          },
        }}
      >
        {/* Animated background glow */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            ".MuiBox-root:hover &": {
              opacity: 1,
            },
            pointerEvents: "none",
          }}
        />
        {/* Header with enhanced icons */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mb={3}
        >
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
                background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                component="img"
                src={tokenA.icon}
                alt={tokenA.name}
                sx={{ width: 32, height: 32 }}
              />
            </Box>
          </motion.div>

          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
            }}
          />

          <motion.div
            whileHover={{ scale: 1.15, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
                background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                component="img"
                src={tokenB.icon}
                alt={tokenB.name}
                sx={{ width: 32, height: 32 }}
              />
            </Box>
          </motion.div>
        </Box>
        <Typography
          sx={{
            color: "#FFFFFF",
            textAlign: "center",
            fontWeight: 700,
            mb: 2,
            fontSize: "1.25rem",
            fontFamily: "Ubuntu, sans-serif",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "relative",
            zIndex: 1,
          }}
        >
          Pool Liquidity
        </Typography>
        <Divider
          sx={{
            mb: 2,
            borderColor: "rgba(249, 115, 22, 0.2)",
            background:
              "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)",
            height: "1px",
            border: "none",
          }}
        />
        <GlowingChart data={poolHistory} />{" "}
        <Grid
          container
          spacing={2}
          mt={1}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={4}>
            <Typography
              sx={{
                color: "rgba(249, 115, 22, 0.7)",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "Ubuntu, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {tokenA.name}
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {liquidityA}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              sx={{
                color: "rgba(251, 146, 60, 0.7)",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "Ubuntu, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {tokenB.name}
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {liquidityB}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "Ubuntu, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Ratio
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              1:{(liquidityB / liquidityA).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <LabTabs
          tokenA={tokenA}
          tokenB={tokenB}
          liquidityA={liquidityA}
          liquidityB={liquidityB}
          liquidityToken={liquidityToken}
          onAddLiquidity={onAddLiquidity}
          onRemoveLiquidity={onRemoveLiquidity}
        />
      </Box>
    </motion.div>
  );
};

export default PoolLiquidity;
