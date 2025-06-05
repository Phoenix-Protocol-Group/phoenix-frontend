import React from "react";
import { Box, Typography } from "@mui/material";
import { commonStyles, colors, typography } from "../Theme/styleConstants";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <Box
      sx={{
        ...commonStyles.tooltip,
        minWidth: "150px",
      }}
    >
      {label && (
        <Typography
          sx={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeights.medium,
            color: colors.neutral[300],
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </Typography>
      )}
      
      {payload.map((entry, index) => (
        <Box 
          key={`item-${index}`}
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: index < payload.length - 1 ? "0.25rem" : 0 
          }}
        >
          <Typography
            sx={{
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.regular,
              color: colors.neutral[300],
              display: "flex",
              alignItems: "center",
            }}
          >
            {entry.name}: 
          </Typography>
          <Typography
            sx={{
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.bold,
              color: colors.neutral[50],
              marginLeft: "0.5rem",
            }}
          >
            {entry.value.toLocaleString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
