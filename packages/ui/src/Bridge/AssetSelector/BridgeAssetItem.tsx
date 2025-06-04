import React from "react";
import { Box, Button } from "@mui/material";
import { Token } from "@phoenix-protocol/types";

const BridgeAssetItem = ({
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
        padding: "8px",
        color: "white",
        fontSize: "14px",
        lineHeight: "140%",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-start",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        "&:not(:last-of-type)": {
          marginBottom: "8px",
        },
      }}
    >
      <Box
        component={"img"}
        src={token.icon}
        sx={{
          maxWidth: "24px",
          marginRight: "8px",
        }}
      />
      {token.name}
    </Button>
  );
};

export default BridgeAssetItem;
