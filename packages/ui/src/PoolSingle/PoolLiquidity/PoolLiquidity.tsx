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
            <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
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
          stroke="#F97316"
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
    color: "var(--neutral-50, #FAFAFA)",
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: "12px",
    transition: "all 0.3s",
    background: "var(--neutral-900, #171717)",
    border: "1px solid var(--neutral-700, #404040)",
    "&:hover": {
      transform: "scale(1.05)",
      background: "var(--neutral-800, #262626)",
    },
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", mt: 2 }}>
      <TabContext value={value}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <MuiButton
            onClick={() => setValue("1")}
            sx={{
              ...buttonStyles,
              background:
                value === "1" ? "#F97316" : "var(--neutral-900, #171717)",
              "&:hover": {
                background:
                  value === "1" ? "#F97316" : "var(--neutral-800, #262626)",
              },
            }}
          >
            Add Liquidity
          </MuiButton>
          <MuiButton
            onClick={() => setValue("2")}
            sx={{
              ...buttonStyles,
              background:
                value === "2" ? "#F97316" : "var(--neutral-900, #171717)",
              "&:hover": {
                background:
                  value === "2" ? "#F97316" : "var(--neutral-800, #262626)",
              },
            }}
          >
            Remove Liquidity
          </MuiButton>
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
    <Box
      sx={{
        borderRadius: "12px",
        background: "var(--neutral-900, #171717)",
        border: "1px solid var(--neutral-700, #404040)",
        p: 2,
      }}
    >
      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <motion.img
          src={tokenA.icon}
          alt={tokenA.name}
          width={40}
          height={40}
          whileHover={{ scale: 1.1 }}
        />
        <motion.img
          src={tokenB.icon}
          alt={tokenB.name}
          width={40}
          height={40}
          whileHover={{ scale: 1.1 }}
        />
      </Box>
      <Typography
        sx={{
          color: "var(--neutral-50, #FAFAFA)",
          textAlign: "center",
          fontWeight: 500,
          mb: 1,
        }}
      >
        Pool Liquidity
      </Typography>
      <Divider sx={{ mb: 1, borderColor: "var(--neutral-700, #404040)" }} />
      <GlowingChart data={poolHistory} />
      <Grid container spacing={2} mt={1}>
        <Grid item xs={4}>
          <Typography
            sx={{
              color: "var(--neutral-400, #A3A3A3)",
              fontSize: "0.75rem",
              opacity: 1,
            }}
          >
            {tokenA.name}
          </Typography>
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {liquidityA}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            sx={{
              color: "var(--neutral-400, #A3A3A3)",
              fontSize: "0.75rem",
              opacity: 1,
            }}
          >
            {tokenB.name}
          </Typography>
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {liquidityB}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            sx={{
              color: "var(--neutral-400, #A3A3A3)",
              fontSize: "0.75rem",
              opacity: 1,
            }}
          >
            Ratio
          </Typography>
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)",
              fontWeight: 500,
              fontSize: "0.875rem",
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
  );
};

export default PoolLiquidity;
