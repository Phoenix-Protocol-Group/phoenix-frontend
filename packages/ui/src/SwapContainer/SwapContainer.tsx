import { Box, Divider } from "@mui/material";
import SwapBox from "./SwapBox";
import {Button} from "@mui/material";

const SwapAssetsButton = () => {
  return (
    <Button sx={{
      padding: "4px",
      borderRadius: "8px",
      minWidth: 0,
      top: "4px",
      position: "absolute",
      background: "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%), #E2491A",
      transform: "translate(-50%, -50%)",
      left: "50%"
    }}>
      <img src="/ArrowsDownUp.svg"/>
    </Button>
  );
};

const SwapContainer = () => {
  return (
    <Box>
      <SwapBox/>
      <Box sx={{
        height: "8px",
        width: "100%",
        position: "relative"
      }}>
        <SwapAssetsButton/>
      </Box>
      <SwapBox/>
    </Box>
  );
};

export { SwapContainer };
