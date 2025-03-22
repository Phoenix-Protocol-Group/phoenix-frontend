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
        background: "var(--neutral-900, #171717)", // Adjusted background
        border: "1px solid var(--neutral-700, #404040)", // Adjusted border
        color: "var(--neutral-300, #D4D4D4)", // Adjusted color
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 500, // Adjusted font weight
        lineHeight: "1.5",
        mb: 1,
        "&:hover": {
          background: "var(--neutral-800, #262626)", // Adjusted background on hover
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
          opacity: 0.7, // Adjusted opacity
        }}
      />
      {token.name}
    </Button>
  );
};

export default AssetItem;
