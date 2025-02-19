import React from "react";
import { Box, Modal as MuiModal, Tab, Tabs, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { VestingTokensModalProps } from "@phoenix-protocol/types";
import { useEffect, useState } from "react";
import { PhoenixVestingContract } from "@phoenix-protocol/contracts";
import { DataPoint, VestingChart } from "./VestingChart";
import { Button } from "../../Button/Button";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(512px, 90%)",
  maxWidth: "100vw",
  background: "#1F1F1F",
  borderRadius: "16px",
  boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.6)",
  display: "flex",
  flexDirection: "column" as "column",
  padding: "24px",
  overflow: "hidden",
};

const VestingTokensModal = ({
  open,
  onClose,
  vestingInfo,
  queryAvailableToClaim,
  claim,
}: VestingTokensModalProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [vestingData, setVestingData] = useState(vestingInfo[0]);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [claimable, setClaimable] = useState(BigInt(0));

  const fetchClaimable = async () => {
    const _claimable = await queryAvailableToClaim(BigInt(tabValue));
    setClaimable(_claimable);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setVestingData(vestingInfo[newValue]);
  };

  const doClaim = async () => {
    await claim(BigInt(tabValue));
    await fetchClaimable();
  };

  useEffect(() => {
    setChartData(vestingScheduleToChart(vestingData));
    fetchClaimable();
  }, [vestingData]);

  const vestingScheduleToChart = (
    vestingData: PhoenixVestingContract.VestingInfo
  ): DataPoint[] => {
    switch (vestingData.schedule.tag) {
      case "SaturatingLinear":
        const min_x = Number(vestingData.schedule.values[0].min_x);
        const min_y = Number(vestingData.schedule.values[0].min_y) / 10 ** 7;
        const max_x = Number(vestingData.schedule.values[0].max_x);
        const max_y = Number(vestingData.schedule.values[0].max_y) / 10 ** 7;
        const slope = (max_y - min_y) / (max_x - min_x);

        // Determine a dynamic step size based on range
        const range = max_x - min_x;
        const stepSize = Math.min(86400, Math.floor(range / 100)); // Ensure a reasonable number of steps
        console.log(86400, Math.floor(range / 100));
        const data: DataPoint[] = [];
        for (let i = min_x; i <= max_x; i += stepSize) {
          data.push({
            amount: min_y + slope * (i - min_x),
            timeStamp: i * 1000,
          });
        }
        console.log(data);
        return data;

      case "PiecewiseLinear":
        const steps = vestingData.schedule.values[0].steps;
        const data2: DataPoint[] = [];
        for (let i = 0; i < steps.length; i++) {
          data2.push({
            amount:
              Number(i === 0 ? steps[i].value : steps[i - 1].value) / 10 ** 7,
            timeStamp: Number(steps[i].time) * 1000,
          });
          data2.push({
            amount: Number(steps[i].value) / 10 ** 7,
            timeStamp: Number(steps[i].time) * 1000,
          });
        }
        return data2;
      case "Constant":
      default:
        return [];
    }
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="Vesting-tokens-modal"
      aria-describedby="VestingTokensModal"
    >
      <Box sx={style}>
        {/* Modal Header with Close Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root.Mui-selected": {
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "white",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                height: "48px",
                minHeight: "48px",
                lineHeight: "48px",
                alignItems: "center",
                flexShrink: 0,
              },
              maxWidth: "calc(100% - 40px)",
            }}
            TabIndicatorProps={{
              style: {
                background:
                  "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
              },
            }}
          >
            {vestingInfo.map((cat, index) => (
              <Tab
                key={index}
                label={"Vesting " + cat.index.toString()}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>

          {/* Close Icon */}
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {vestingInfo.map((a, index) => (
          <CustomTabPanel value={tabValue} index={index} key={index}>
            <VestingChart data={chartData} />

            {/* Claimable Info */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  color: "white",
                  fontFamily: "Ubuntu",
                  fontSize: "1.125rem",
                }}
              >
                Claimable: {(Number(claimable) / 10 ** 7).toString()} PHO
              </Box>
            </Box>

            {/* Claim Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button onClick={() => doClaim()}>Claim</Button>
            </Box>
          </CustomTabPanel>
        ))}
      </Box>
    </MuiModal>
  );
};

export { VestingTokensModal };
