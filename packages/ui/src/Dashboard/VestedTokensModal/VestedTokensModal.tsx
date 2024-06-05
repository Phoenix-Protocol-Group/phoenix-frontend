import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Tabs,
  Tab,
} from "@mui/material";
import Colors from "../../Theme/colors";
import { VestedTokensModalProps } from "@phoenix-protocol/types";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  TooltipProps,
  Dot,
  XAxis,
} from "recharts";
import { Button } from "../../Button/Button";

interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const y = parseFloat(payload[0].payload?.y);
    const x = new Date(payload[0].payload?.x * 1000).toLocaleDateString();

    return (
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.75)", // Dark background with 75% opacity
          color: "#fff", // White text color for contrast
          padding: "10px",
          border: "1px solid #E2491A", // Border color matching the line color
          borderRadius: "4px",
        }}
      >
        <Typography fontSize={12}>{x}</Typography>
        <Typography fontSize={12}>Vested: {y}</Typography>
      </Box>
    );
  }

  return null;
};

const CustomDot = (props) => {
  const { cx, cy, value } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        stroke="#E2491A"
        strokeWidth={2}
        fill="#E2491A"
      />
    </g>
  );
};

const GlowingChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
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
        dataKey="y"
        domain={[(dataMin) => dataMin * 0.9, "dataMax"]}
      />
      <XAxis
        dataKey="x"
        tickFormatter={(tick) => new Date(tick * 1000).toLocaleDateString()}
        interval="preserveStartEnd"
      />
      <Area
        type="monotone"
        dataKey="y"
        stroke="#E2491A"
        strokeWidth={2}
        isAnimationActive={true}
        fillOpacity={1}
        fill="url(#colorUv)"
        activeDot={<CustomDot />}
      />
      <Tooltip content={<CustomTooltip />} cursor={false} />
    </AreaChart>
  </ResponsiveContainer>
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const VestedTokensModal = ({
  open,
  onClose,
  graphData,
  claimableAmount,
  token, 
  index,
  setIndex,
  onButtonClick,
  loading,
}: VestedTokensModalProps): React.ReactNode => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 512,
    maxWidth: "calc(100vw - 16px)",
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  return (
    <MuiModal
      open={open}
      aria-labelledby="vested-tokens-modal"
      aria-describedby="Vested "
    >
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              onClick={() => onClose()}
              component="img"
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                w: "16px",
                h: "16px",
                backgroundColor: Colors.inputsHover,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              src="/x.svg"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Vested Tokens
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: "100%", my: 1 }}>
              <Tabs value={index} onChange={handleChange} aria-label="tabs of vested tokens">
                {graphData && Object.entries(graphData).map(([key, val]) => (
                  <Tab key={key} label={`Vesting ${key+1}`} {...a11yProps(0)} />
                ))}
              </Tabs>
            </Box>

            <Box p={2} width={"100%"}>
              {graphData && Object.entries(graphData).map(([key, val]) => (
                <CustomTabPanel value={index} index={Number(key)} key={key}>
                  <GlowingChart data={val} />
                </CustomTabPanel>
              ))}
            </Box>
            <Box mb={2}>
              <Typography>
                Claimable: {claimableAmount && claimableAmount[index] && parseFloat(claimableAmount[index].toString())} {token && token.name}
              </Typography>
            </Box>
            <Button
              onClick={onButtonClick}
              label={loading ? "Loading..." : "Claim"}
            />
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { VestedTokensModal };
