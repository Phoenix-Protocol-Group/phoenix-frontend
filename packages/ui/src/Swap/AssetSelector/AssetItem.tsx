import React from "react";
import { Box, Button } from "@mui/material";
import { Token } from "@phoenix-protocol/types";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

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
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: borderRadius.sm,
        background: colors.neutral[900],
        border: `1px solid ${colors.neutral[700]}`,
        color: colors.neutral[300],
        textTransform: "none",
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeights.medium,
        fontFamily: typography.fontFamily,
        lineHeight: 1.5,
        mb: 1,
        "&:hover": {
          background: colors.neutral[800],
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
          marginRight: spacing.md,
          opacity: 0.7,
        }}
      />
      {token.name}
    </Button>
  );
};

export default AssetItem;
