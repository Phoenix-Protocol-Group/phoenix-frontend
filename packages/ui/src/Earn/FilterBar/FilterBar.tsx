import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

export interface FilterBarProps {
  assetsFilter: "Your assets" | "All Assets";
  onAssetsFilterChange: (value: "Your assets" | "All Assets") => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  platformFilter: string;
  onPlatformFilterChange: (value: string) => void;
  instantUnbondOnly: boolean;
  onInstantUnbondOnlyChange: (value: boolean) => void;
  types: string[];
  platforms: string[];
}

const FilterBar = ({
  assetsFilter,
  onAssetsFilterChange,
  typeFilter,
  onTypeFilterChange,
  platformFilter,
  onPlatformFilterChange,
  instantUnbondOnly,
  onInstantUnbondOnlyChange,
  types,
  platforms,
}: FilterBarProps) => {
  // Common select styles
  const selectStyles = {
    color: colors.neutral[300],
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeights.regular,
    borderRadius: borderRadius.lg,
    background: colors.neutral[900],
    border: `1px solid ${colors.neutral[700]}`,
    transition: "all 0.2s ease",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiSelect-select": {
      padding: `${spacing.xs} ${spacing.sm}`,
      margin: 0,
    },
    "& .MuiSelect-select:not([value])": {
      color: colors.neutral[300],
    },
    "&:hover": {
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 1px ${colors.primary.main}25`,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.md,
          borderRadius: borderRadius.lg,
          width: "100%",
          gap: spacing.md,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: spacing.md,
            flexWrap: "wrap",
            "& > *": {
              minWidth: "150px",
              maxWidth: "200px",
            },
          }}
        >
          <FormControl fullWidth>
            <Select
              value={assetsFilter}
              onChange={(e) =>
                onAssetsFilterChange(
                  e.target.value as "Your assets" | "All Assets"
                )
              }
              placeholder="Assets"
              displayEmpty
              sx={selectStyles}
            >
              <MenuItem value="Your assets">Your assets</MenuItem>
              <MenuItem value="All Assets">All Assets</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              placeholder="Type"
              displayEmpty
              sx={selectStyles}
            >
              <MenuItem value="All">All Types</MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={platformFilter}
              onChange={(e) => onPlatformFilterChange(e.target.value)}
              displayEmpty
              sx={selectStyles}
            >
              <MenuItem value="All">All Platforms</MenuItem>
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={instantUnbondOnly}
                onChange={(e) => onInstantUnbondOnlyChange(e.target.checked)}
                sx={{
                  color: colors.neutral[50],
                  "& .MuiSwitch-track": {
                    backgroundColor: instantUnbondOnly 
                      ? colors.success[300] 
                      : colors.neutral[700],
                    opacity: 1,
                    border: "none",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: colors.neutral[50],
                  },
                  "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
                    opacity: 0.5,
                  },
                }}
              />
            }
            label={
              <Typography 
                sx={{ 
                  color: colors.neutral[300],
                  fontSize: typography.fontSize.sm, 
                  fontWeight: typography.fontWeights.medium
                }}
              >
                Instant Unbond Only
              </Typography>
            }
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export { FilterBar };
