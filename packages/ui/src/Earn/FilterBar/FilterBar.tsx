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
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          "& > *": {
            flex: "1 1 auto",
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
            sx={{
              color: "#D4D4D4", // var(--neutral-300, #D4D4D4)
              fontFamily: "Ubuntu",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              borderRadius: "1rem",
              background: "#171717", // var(--neutral-900, #171717)
              border: "1px solid #404040", // var(--neutral-700, #404040)
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                margin: 0,
              },
            }}
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
            sx={{
              color: "#D4D4D4", // var(--neutral-300, #D4D4D4)
              fontFamily: "Ubuntu",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              borderRadius: "1rem",
              background: "#171717", // var(--neutral-900, #171717)
              border: "1px solid #404040", // var(--neutral-700, #404040)
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                margin: 0,
              },
            }}
          >
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
            placeholder="Platform"
            sx={{
              color: "#D4D4D4", // var(--neutral-300, #D4D4D4)
              fontFamily: "Ubuntu",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              borderRadius: "1rem",
              background: "#171717", // var(--neutral-900, #171717)
              border: "1px solid #404040", // var(--neutral-700, #404040)
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                margin: 0,
              },
            }}
          >
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
                color: "#FAFAFA", // var(--neutral-50)
                "& .MuiSwitch-track": {
                  backgroundColor: instantUnbondOnly ? "#66BB6A" : "#404040", // var(--success-300) : var(--neutral-700)
                  opacity: 1,
                  border: "none",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: "#FAFAFA", // var(--neutral-50)
                },
                "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
                  opacity: 0.5,
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: "#D4D4D4" }}>
              Instant Unbond Only
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export { FilterBar };
