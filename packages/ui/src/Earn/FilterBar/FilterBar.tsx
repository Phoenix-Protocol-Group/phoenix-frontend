import React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

interface FilterBarProps {
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

export const FilterBar = ({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const allTypes = ["All", ...types];
  const allPlatforms = ["All", ...platforms];

  // Handle toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInstantUnbondOnlyChange(event.target.checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        gap: spacing.md,
        mb: 3,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        background: "rgba(18, 18, 18, 0.40)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Assets Filter */}
      <Box
        sx={{
          display: "flex",
          gap: spacing.xs,
          flexShrink: 0,
        }}
      >
        <Button
          variant="text"
          onClick={() => onAssetsFilterChange("Your assets")}
          sx={{
            color: assetsFilter === "Your assets" ? "#FAFAFA" : "#A3A3A3",
            fontWeight: assetsFilter === "Your assets" ? 500 : 400,
            fontSize: "14px",
            textTransform: "none",
            p: 1,
            minWidth: "auto",
            borderBottom:
              assetsFilter === "Your assets" ? "2px solid #F97316" : "none",
            borderRadius: 0,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#FAFAFA",
            },
          }}
        >
          Your assets
        </Button>
        <Button
          variant="text"
          onClick={() => onAssetsFilterChange("All Assets")}
          sx={{
            color: assetsFilter === "All Assets" ? "#FAFAFA" : "#A3A3A3",
            fontWeight: assetsFilter === "All Assets" ? 500 : 400,
            fontSize: "14px",
            textTransform: "none",
            p: 1,
            minWidth: "auto",
            borderBottom:
              assetsFilter === "All Assets" ? "2px solid #F97316" : "none",
            borderRadius: 0,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#FAFAFA",
            },
          }}
        >
          All assets
        </Button>
      </Box>

      {/* Type Filter */}
      <Box sx={{ minWidth: 120, flexGrow: isMobile ? 1 : 0 }}>
        <Typography
          sx={{
            color: "#A3A3A3",
            fontSize: "12px",
            mb: 0.5,
          }}
        >
          Type
        </Typography>
        <Select
          value={typeFilter}
          onChange={(e: SelectChangeEvent) =>
            onTypeFilterChange(e.target.value as string)
          }
          size="small"
          sx={{
            color: "#D4D4D4",
            fontSize: "14px",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            ".MuiSvgIcon-root": {
              color: "#D4D4D4",
            },
            minWidth: "100px",
            maxWidth: "150px",
          }}
        >
          {allTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Platform Filter */}
      <Box sx={{ minWidth: 120, flexGrow: isMobile ? 1 : 0 }}>
        <Typography
          sx={{
            color: "#A3A3A3",
            fontSize: "12px",
            mb: 0.5,
          }}
        >
          Platform
        </Typography>
        <Select
          value={platformFilter}
          onChange={(e: SelectChangeEvent) =>
            onPlatformFilterChange(e.target.value as string)
          }
          size="small"
          sx={{
            color: "#D4D4D4",
            fontSize: "14px",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            ".MuiSvgIcon-root": {
              color: "#D4D4D4",
            },
            minWidth: "100px",
            maxWidth: "150px",
          }}
        >
          {allPlatforms.map((platform) => (
            <MenuItem key={platform} value={platform}>
              {platform}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Instant Unbond Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          gap: 0.5,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={instantUnbondOnly}
              onChange={handleToggleChange}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#F97316",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(249, 115, 22, 0.5)",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                color: "#D4D4D4",
                fontSize: "14px",
              }}
            >
              Instant unbond only
            </Typography>
          }
          sx={{ ml: 0, mr: 0 }}
        />
        <Tooltip
          title="Show only strategies with instant unbonding"
          placement="top"
          arrow
        >
          <InfoOutlinedIcon
            sx={{
              color: "#A3A3A3",
              fontSize: "16px",
              cursor: "help",
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};
