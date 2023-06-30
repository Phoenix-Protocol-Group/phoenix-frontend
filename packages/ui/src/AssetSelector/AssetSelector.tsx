import { Box, Input, Typography } from "@mui/material";
import AssetItem from "./AssetItem";

const containerStyle = {
  borderRadius: "16px",
  background: "linear-gradient(180deg, #292B2C 0%, #222426 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  padding: "16px",
  marginBottom: "16px"
}

const headerStyle = {
  fontSize: "13px",
  lineHeight: "18px",
  marginBottom: "18px"
};

const AssetSelector = () => {
  return (
    <Box sx={{
      maxWidth: "600px",
    }}>
      <Typography sx={{
        color: "white",
        fontSize: "32px"
      }}>Select Token</Typography>
      <Input
        placeholder="Search by name or address"
        sx={{
          width: "100%",
          borderRadius: "16px",
          border: "1px solid #2D303A",
          background: "#1D1F21",
          padding: "8px 16px",
          lineHeight: "18px",
          fontSize: "13px",
          marginBottom: "16px",
          "&:before": {
            content: "none"
          },
          "&:after": {
            content: "none"
          }
        }}
        startAdornment={
          <img style={{marginRight: "8px"}} src="/MagnifyingGlass.svg"/>
        }
      />
      <Box sx={containerStyle}>
        <Typography sx={headerStyle}>Quick select</Typography>
      </Box>
      <Box sx={containerStyle}>
        <Typography sx={headerStyle}>All tokens</Typography>
        <Box sx={{
          maxHeight: "50vh",
          overflow: "auto",
        }}>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
          <AssetItem label="BTC"/>
        </Box>
      </Box>
    </Box>
  );
};

export { AssetSelector };
