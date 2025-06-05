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
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: spacing.md,
          mb: 3,
          padding: spacing.lg,
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(249, 115, 22, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(249, 115, 22, 0.02) 0%, rgba(251, 146, 60, 0.02) 50%, rgba(249, 115, 22, 0.02) 100%)",
            zIndex: 0,
          },
        }}
      >
        {/* Assets Filter */}
        <Box
          sx={{
            display: "flex",
            gap: spacing.xs,
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Button
            variant="text"
            onClick={() => onAssetsFilterChange("Your assets")}
            sx={{
              color: assetsFilter === "Your assets" ? "#FAFAFA" : "#A3A3A3",
              fontWeight: assetsFilter === "Your assets" ? 600 : 400,
              fontSize: "14px",
              textTransform: "none",
              p: spacing.sm,
              minWidth: "auto",
              borderRadius: "8px",
              position: "relative",
              background:
                assetsFilter === "Your assets"
                  ? "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)"
                  : "transparent",
              border:
                assetsFilter === "Your assets"
                  ? "1px solid rgba(249, 115, 22, 0.3)"
                  : "1px solid transparent",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                color: "#FAFAFA",
                transform: "translateY(-1px)",
              },
              "&::after":
                assetsFilter === "Your assets"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70%",
                      height: "2px",
                      background:
                        "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                      borderRadius: "1px",
                    }
                  : {},
            }}
          >
            Your assets
          </Button>
          <Button
            variant="text"
            onClick={() => onAssetsFilterChange("All Assets")}
            sx={{
              color: assetsFilter === "All Assets" ? "#FAFAFA" : "#A3A3A3",
              fontWeight: assetsFilter === "All Assets" ? 600 : 400,
              fontSize: "14px",
              textTransform: "none",
              p: spacing.sm,
              minWidth: "auto",
              borderRadius: "8px",
              position: "relative",
              background:
                assetsFilter === "All Assets"
                  ? "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)"
                  : "transparent",
              border:
                assetsFilter === "All Assets"
                  ? "1px solid rgba(249, 115, 22, 0.3)"
                  : "1px solid transparent",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                color: "#FAFAFA",
                transform: "translateY(-1px)",
              },
              "&::after":
                assetsFilter === "All Assets"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70%",
                      height: "2px",
                      background:
                        "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                      borderRadius: "1px",
                    }
                  : {},
            }}
          >
            All assets
          </Button>
        </Box>

        {/* Type Filter */}
        <Box
          sx={{
            minWidth: 120,
            flexGrow: isMobile ? 1 : 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: "#D4D4D4",
              fontSize: "12px",
              fontWeight: 500,
              mb: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
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
              color: "#FAFAFA",
              fontSize: "14px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.2)",
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.4)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.6)",
              },
              ".MuiSvgIcon-root": {
                color: "#F97316",
              },
              minWidth: "100px",
              maxWidth: "150px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                background: "rgba(249, 115, 22, 0.05)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background:
                    "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  borderRadius: "10px",
                  "& .MuiMenuItem-root": {
                    color: "#FAFAFA",
                    "&:hover": {
                      background: "rgba(249, 115, 22, 0.1)",
                    },
                    "&.Mui-selected": {
                      background: "rgba(249, 115, 22, 0.2)",
                    },
                  },
                },
              },
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
        <Box
          sx={{
            minWidth: 120,
            flexGrow: isMobile ? 1 : 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: "#D4D4D4",
              fontSize: "12px",
              fontWeight: 500,
              mb: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
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
              color: "#FAFAFA",
              fontSize: "14px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.2)",
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.4)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(249, 115, 22, 0.6)",
              },
              ".MuiSvgIcon-root": {
                color: "#F97316",
              },
              minWidth: "100px",
              maxWidth: "150px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                background: "rgba(249, 115, 22, 0.05)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background:
                    "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  borderRadius: "10px",
                  "& .MuiMenuItem-root": {
                    color: "#FAFAFA",
                    "&:hover": {
                      background: "rgba(249, 115, 22, 0.1)",
                    },
                    "&.Mui-selected": {
                      background: "rgba(249, 115, 22, 0.2)",
                    },
                  },
                },
              },
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
            position: "relative",
            zIndex: 1,
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
                    "&:hover": {
                      backgroundColor: "rgba(249, 115, 22, 0.08)",
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "rgba(249, 115, 22, 0.6)",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "rgba(115, 115, 115, 0.4)",
                  },
                  "& .MuiSwitch-thumb": {
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: "#FAFAFA",
                  fontSize: "14px",
                  fontWeight: 500,
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
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "rgba(15, 15, 15, 0.95)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                },
                "& .MuiTooltip-arrow": {
                  color: "rgba(15, 15, 15, 0.95)",
                  "&::before": {
                    border: "1px solid rgba(249, 115, 22, 0.2)",
                  },
                },
              },
            }}
          >
            <InfoOutlinedIcon
              sx={{
                color: "#F97316",
                fontSize: "18px",
                cursor: "help",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#FB923C",
                  transform: "scale(1.1)",
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>
    </motion.div>
  );
};
