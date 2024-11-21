import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button as MuiButton,
  Divider,
  Grid,
  Typography,
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
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {number[][]} props.data - Data to be used in the chart.
 */
const GlowingChart = ({ data }: { data: number[][] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart
      data={data}
      margin={{ top: 0, right: -10, left: -10, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#E2491A" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#E2491A" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <YAxis
        hide={true}
        dataKey={(v) => v[1]}
        domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
      />
      <Area
        type="monotone"
        dataKey={(v) => v[1]}
        stroke="#E2491A"
        strokeWidth={2}
        isAnimationActive={true}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

/**
 * LabTabs Component
 * Handles Add and Remove liquidity for tokens.
 *
 * @component
 * @param {LabTabProps} props - Component properties.
 * @param {Object} props.tokenA - Token A details.
 * @param {Object} props.tokenB - Token B details.
 * @param {number} props.liquidityA - Liquidity of token A.
 * @param {number} props.liquidityB - Liquidity of token B.
 * @param {Object} props.liquidityToken - Liquidity token details.
 * @param {Function} props.onAddLiquidity - Function to handle adding liquidity.
 * @param {Function} props.onRemoveLiquidity - Function to handle removing liquidity.
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
      const valB = Number(val) / liquidityRatio;
      setTokenBValue(valB.toFixed(4));
    },
    [liquidityRatio]
  );

  const keepRatioB = useCallback(
    (val: string) => {
      setTokenBValue(val);
      const valA = Number(val) * liquidityRatio;
      setTokenAValue(valA.toFixed(4));
    },
    [liquidityRatio]
  );

  const buttonStyles = {
    display: "flex",
    height: "2.5rem",
    padding: "0rem 0.75rem",
    borderRadius: "0.5rem",
    textTransform: "none",
    color: "white",
    fontWeight: 700,
    fontSize: "0.875rem",
    background: "none",
    boxShadow: "none",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: "#37373D",
      boxShadow: "none",
    },
  };

  const tokenBoxStyles = {
    width: "100%",
    maxWidth: "350px",
    mx: "auto", // Center horizontally
  };

  return (
    <Box
      className="liquidity"
      sx={{ width: "100%", typography: "body1", mt: 2, p: "1.4rem" }}
    >
      <TabContext value={value}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MuiButton
            variant="contained"
            onClick={() => setValue("1")}
            sx={{
              ...buttonStyles,
              background: value === "1" ? "#37373D" : "none",
              transition: "all 0.3s ease-in-out",
              flex: 1,
              maxWidth: "200px",
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            Add liquidity
          </MuiButton>
          <MuiButton
            variant="contained"
            onClick={() => setValue("2")}
            sx={{
              ...buttonStyles,
              background: value === "2" ? "#37373D" : "none",
              ml: 1,
              transition: "all 0.3s ease-in-out",
              flex: 1,
              maxWidth: "200px",
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            Remove liquidity
          </MuiButton>
        </Box>
        <TabPanel sx={{ padding: "0", mt: "1rem" }} value="1">
          <Box sx={tokenBoxStyles}>
            <TokenBox
              value={tokenAValue}
              onChange={(val) => keepRatioA(val)}
              token={tokenA}
              hideDropdownButton={true}
            />
          </Box>
          <Box sx={{ mt: "0.5rem", ...tokenBoxStyles }}>
            <TokenBox
              onChange={(val) => keepRatioB(val)}
              value={tokenBValue}
              token={tokenB}
              hideDropdownButton={true}
            />
          </Box>
          <Button
            onClick={() =>
              onAddLiquidity(Number(tokenAValue), Number(tokenBValue))
            }
            sx={{
              mt: "2rem",
              mx: "auto",
              display: "block",
              alignItems: "center",
            }}
            fullWidth
          >
            Add Liquidity
          </Button>
        </TabPanel>
        <TabPanel sx={{ padding: "0", mt: "1rem" }} value="2">
          <Box sx={tokenBoxStyles}>
            <TokenBox
              onChange={(val) => setTokenCValue(val)}
              value={tokenCValue}
              token={liquidityToken}
              hideDropdownButton={true}
            />
          </Box>
          <Button
            onClick={() => onRemoveLiquidity(Number(tokenCValue))}
            sx={{
              mt: "2rem",
              mx: "auto",
              display: "block",
              alignItems: "center",
            }}
            fullWidth
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
 * Displays pool information, liquidity stats, and allows users to add or remove liquidity.
 *
 * @component
 * @param {PoolLiquidityProps} props - Component properties.
 * @param {Object} props.tokenA - Token A details.
 * @param {Object} props.tokenB - Token B details.
 * @param {number} props.liquidityA - Liquidity of token A.
 * @param {number} props.liquidityB - Liquidity of token B.
 * @param {Object} props.liquidityToken - Liquidity token details.
 * @param {Array} props.poolHistory - Historical data for the pool.
 * @param {Function} props.onAddLiquidity - Function to handle adding liquidity.
 * @param {Function} props.onRemoveLiquidity - Function to handle removing liquidity.
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
        borderRadius: "0.5rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        backdropFilter: "blur(42px)",
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ padding: "1.5rem" }}>
          <Box
            sx={{ height: "4rem", width: "4rem" }}
            component={motion.img}
            src={tokenA.icon}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <Box
            sx={{ ml: -1, height: "4rem", width: "4rem" }}
            component={motion.img}
            src={tokenB.icon}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </Box>
      </Box>
      <Divider />
      <Box>
        <Typography
          sx={{
            p: "1.5rem",
            opacity: 0.7,
            fontWeight: 400,
            fontSize: "0.875rem",
          }}
        >
          Pool liquidity
        </Typography>
        <GlowingChart data={poolHistory} />
        <Grid container>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.875rem", opacity: 0.7 }}>
                  {tokenA.name}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  {liquidityA}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.875rem", opacity: 0.7 }}>
                  {tokenB.name}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  {liquidityB}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.875rem", opacity: 0.7 }}>
                  Ratio
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  1:{(liquidityB / liquidityA).toFixed(2)}
                </Typography>
              </Box>
            </Box>
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
    </Box>
  );
};

export default PoolLiquidity;
