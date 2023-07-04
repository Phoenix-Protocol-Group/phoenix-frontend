import {
  Box,
  Button as MuiButton,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { TokenBox } from "../../TokenBox/TokenBox";
import { Button } from "../../Button/Button";

type Data = number[];

const mockDataset2: number[][] = [
  [1687392000000, 152000],
  [1687478400000, 140400],
  [1687564800000, 160100],
  [1687651200000, 163300],
  [1687737600000, 150000],
  [1687824000000, 180000],
  [1687859473000, 200000],
];

const tokenA = {
  name: "BTC",
  icon: "cryptoIcons/btc.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const tokenB = {
  name: "USDC",
  icon: "cryptoIcons/usdc.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const tokenC = {
  name: "BTC/USDC",
  icon: "cryptoIcons/usdc.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const GlowingChart = ({ data }: { data: Data[] }) => (
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

const LabTabs = () => {
  const [value, setValue] = useState("1");

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
          <TokenBox token={tokenA} hideDropdownButton={true} />
          <Box sx={{ mt: "0.5rem" }}>
            <TokenBox token={tokenB} hideDropdownButton={true} />
          </Box>
          {/* @ts-ignore */}
          <Button sx={{ mt: "0.5rem" }} fullWidth variant="primary">
            Add Liquidity
          </Button>
        </TabPanel>
        <TabPanel sx={{ padding: "0", mt: "1rem" }} value="2">
          <TokenBox token={tokenC} hideDropdownButton={true} />
          {/* @ts-ignore */}
          <Button sx={{ mt: "0.5rem" }} fullWidth variant="primary">
            Remove Liquidity
          </Button>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

const PoolLiquidity = ({}) => {
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
            src="cryptoIcons/btc.svg"
          />
          <Box
            sx={{ ml: -1, height: "4rem", width: "4rem" }}
            component="img"
            src="cryptoIcons/usdc.svg"
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
        <GlowingChart data={mockDataset2} />
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
                  BTC
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  10,784.99
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
                  USDC
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  10,784.99
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
                  1:1.05
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <LabTabs />
      </Box>
    </Box>
  );
};

export default PoolLiquidity;
