import { Box, Divider } from "@mui/material";
import SwapBox from "./SwapBox";

const SwapContainer = () => {
  return (
    <Box>
      <SwapBox/>
      <Box sx={{
        marginBottom: 1
      }}></Box>
      <SwapBox/>
    </Box>
  );
};

export { SwapContainer };
