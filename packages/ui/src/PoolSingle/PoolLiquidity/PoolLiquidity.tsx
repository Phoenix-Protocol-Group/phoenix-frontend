import React from "react";
import {
  Box,
  Button as MuiButton,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { TokenBox } from "../../Swap";
import { Button } from "../../Button/Button";
import { PoolLiquidityProps, LabTabProps } from "@phoenix-protocol/types";

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

  const liquidityRatio = liquidityA / liquidityB;

  const keepRatioA = (val: string) => {
    setTokenAValue(val);

    const valB = Number(val) / liquidityRatio;
    setTokenBValue(valB.toFixed(4));
  };

  const keepRatioB = (val: string) => {
    setTokenBValue(val);

    const valA = Number(val) * liquidityRatio;
    setTokenAValue(valA.toFixed(4));
  };

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
    "&:hover": {
      background: "#37373D",
      boxShadow: "none",
    },
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", mt: 2, p: "1.4rem" }}>
      <TabContext value={value}>
        <Box sx={{ display: "flex" }}>
          <MuiButton
            variant="contained"
            onClick={() => setValue("1")}
            sx={{
              ...buttonStyles,
              background: value === "1" ? "#37373D" : "none",
            }}
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
            }}
          >
            Remove liquidity
          </MuiButton>
        </Box>
        <TabPanel sx={{ padding: "0", mt: "1rem" }} value="1">
          <TokenBox
            value={tokenAValue}
            onChange={(val) => keepRatioA(val)}
            token={tokenA}
            hideDropdownButton={true}
          />
          <Box sx={{ mt: "0.5rem" }}>
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
            sx={{ mt: "0.5rem" }}
            fullWidth
            // @ts-ignore
            variant="primary"
          >
            Add Liquidity
          </Button>
        </TabPanel>
        <TabPanel sx={{ padding: "0", mt: "1rem" }} value="2">
          <TokenBox
            onChange={(val) => setTokenCValue(val)}
            value={tokenCValue}
            token={liquidityToken}
            hideDropdownButton={true}
          />
          <Button
            onClick={() => onRemoveLiquidity(Number(tokenCValue))}
            sx={{ mt: "0.5rem" }}
            fullWidth
            // @ts-ignore
            variant="primary"
          >
            Remove Liquidity
          </Button>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

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
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ padding: "1.5rem" }}>
          <Box
            sx={{ height: "4rem", width: "4rem" }}
            component="img"
            src={tokenA.icon}
          />
          <Box
            sx={{ ml: -1, height: "4rem", width: "4rem" }}
            component="img"
            src={tokenB.icon}
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
