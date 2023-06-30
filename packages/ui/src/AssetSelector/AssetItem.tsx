import { Box } from "@mui/material";

import { Token } from "./AssetSelector";

const AssetItem = ({
  token
}: {
  token: Token
}) => {
  return (
    <Box sx={{
      padding: "8px",
      color: "white",
      fontSize: "14px",
      lineHeight: "140%",
      borderRadius: "8px",
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      "&:not(:last-of-type)": {
        marginBottom: "8px"
      }
    }}>
      {token.icon}{token.name}
    </Box>
  );
};

export default AssetItem;
