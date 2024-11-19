import React from "react";
import { Box, Button } from "@mui/material";
import { Token } from "@phoenix-protocol/types";

/**
 * AssetItem
 * A clickable button representing a single token with its name and icon.
 *
 * @param {Object} props
 * @param {Token} props.token - The token details.
 * @param {function} props.onClick - The function to execute on clicking the token.
 * @returns {JSX.Element}
 */
const AssetItem = ({
  token,
  onClick,
}: {
  token: Token;
  onClick: (token: Token) => void;
}) => {
  return (
    <Button
      onClick={() => onClick(token)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        padding: "8px 12px",
        borderRadius: "8px",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        color: "white",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "1.5",
        mb: 1,
        "&:hover": {
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        },
      }}
    >
      <Box
        component="img"
        src={token.icon}
        alt={token.name}
        sx={{
          width: "24px",
          height: "24px",
          marginRight: "12px",
        }}
      />
      {token.name}
    </Button>
  );
};

export default AssetItem;
