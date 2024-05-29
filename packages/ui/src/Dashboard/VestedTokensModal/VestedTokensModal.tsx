import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
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

const VestedTokensModal = ({
  open,
  onClose,
  vestingInfo,
  onButtonClick,
  loading,
}: VestedTokensModalProps): React.ReactNode => {
  const [linearData, setLinearData] = useState([]);
  const [balance, setBalance] = useState(0);
  const [index, setIndex] = useState<number>(0);

  const generateLinearData = (vestingInfo: any[]) => {
    const graphData = [];

    //@TODO take indexes state instead of looping all vested infos again
    vestingInfo.map((info: any, _index: number) => {
      const balance = parseInt(info.balance, 10);
      const type = info.schedule.tag;
      const oneDay = 86400;

      if (balance === 0 || graphData.length) return;

      setIndex(_index);
      setBalance(balance / 10 ** 7);

      if (type === "SaturatingLinear") {
        const { max_x, max_y, min_x, min_y } = info.schedule.values[0];

        const maxX = parseInt(max_x, 10);
        const maxY = parseInt(max_y, 10) / 10 ** 7;
        const minX = parseInt(min_x, 10);
        const minY = parseInt(min_y, 10) / 10 ** 7;

        const slope = (maxY - minY) / (maxX - minX);
        const intercept = minY - slope * minX;

        const data = [];

        for (let x = minX; x <= maxX; x += oneDay) {
          const y = slope * x + intercept;
          data.push({ x, y });
        }

        graphData.push(data);
      } else if (type === "PiecewiseLinear") {
        const items = info.schedule.values[0].steps;

        //needed for nested array in recharts
        const data = []
        items.forEach((segment, index) => {
          if (index < items.length - 1) {
            const startTime = parseInt(segment.time, 10);
            const endTime = parseInt(items[index + 1].time, 10);
            const startValue = parseInt(segment.value, 10) / 10 ** 7;
            const endValue = parseInt(items[index + 1].value, 10) / 10 ** 7;
      
            const slope = (endValue - startValue) / (endTime - startTime);
            const intercept = startValue - slope * startTime;

            for (let time = startTime; time <= endTime; time += oneDay) {
              const value = slope * time + intercept;
              data.push({ x: time, y: value });
            }
          }
        });

        graphData.push(data);
      }
    });

    return graphData;
  };

  useEffect(() => {
    if (vestingInfo) {
      const data = generateLinearData(vestingInfo);
      console.log(data);
      setLinearData(data);
    }
  }, [vestingInfo]);

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

            <Box p={2} width={"100%"}>
              <GlowingChart data={linearData[0] || undefined} />
            </Box>
            <Box mb={2}>
              <Typography>
                Claimable: {parseFloat(balance.toString())}
              </Typography>
            </Box>
            <Button
              onClick={() => onButtonClick(index)}
              label={loading ? "Loading..." : "Claim"}
            />
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { VestedTokensModal };
