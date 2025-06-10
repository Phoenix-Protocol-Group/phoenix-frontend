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
  FormControl,
} from "@mui/material";
import { motion } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: spacing.md,
          p: spacing.lg,
          borderRadius: borderRadius.lg,
          background: `linear-gradient(135deg, ${colors.neutral[800]}30 0%, ${colors.neutral[900]}50 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.neutral[700]}`,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.primary.main}40, transparent)`,
            zIndex: 1,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}30`,
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.2)`,
          },
          transition: "all 0.2s ease",
        }}
      >
        {/* Assets Filter */}
        <Box
          sx={{
            display: "flex",
            gap: spacing.xs,
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
            background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
            borderRadius: borderRadius.md,
            p: spacing.xs,
            border: `1px solid ${colors.neutral[700]}`,
          }}
        >
          <Button
            variant="text"
            onClick={() => onAssetsFilterChange("Your assets")}
            sx={{
              color:
                assetsFilter === "Your assets"
                  ? colors.neutral[50]
                  : colors.neutral[400],
              fontWeight:
                assetsFilter === "Your assets"
                  ? typography.fontWeights.semiBold
                  : typography.fontWeights.medium,
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily,
              textTransform: "none",
              px: spacing.md,
              py: spacing.sm,
              minWidth: "auto",
              borderRadius: borderRadius.sm,
              background:
                assetsFilter === "Your assets"
                  ? `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`
                  : "transparent",
              border:
                assetsFilter === "Your assets"
                  ? `1px solid ${colors.primary.main}40`
                  : "1px solid transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.main}08 100%)`,
                color: colors.neutral[50],
                transform: "translateY(-1px)",
              },
            }}
          >
            Your assets
          </Button>
          <Button
            variant="text"
            onClick={() => onAssetsFilterChange("All Assets")}
            sx={{
              color:
                assetsFilter === "All Assets"
                  ? colors.neutral[50]
                  : colors.neutral[400],
              fontWeight:
                assetsFilter === "All Assets"
                  ? typography.fontWeights.semiBold
                  : typography.fontWeights.medium,
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily,
              textTransform: "none",
              px: spacing.md,
              py: spacing.sm,
              minWidth: "auto",
              borderRadius: borderRadius.sm,
              background:
                assetsFilter === "All Assets"
                  ? `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`
                  : "transparent",
              border:
                assetsFilter === "All Assets"
                  ? `1px solid ${colors.primary.main}40`
                  : "1px solid transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.main}08 100%)`,
                color: colors.neutral[50],
                transform: "translateY(-1px)",
              },
            }}
          >
            All assets
          </Button>
        </Box>

        {/* Type Filter */}
        <FormControl
          sx={{
            minWidth: 120,
            flexGrow: isMobile ? 1 : 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.neutral[300],
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeights.semiBold,
              fontFamily: typography.fontFamily,
              mb: spacing.xs,
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
              height: "40px",
              borderRadius: borderRadius.md,
              background: `linear-gradient(135deg, ${colors.neutral[800]}60 0%, ${colors.neutral[900]}80 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.neutral[600]}`,
              color: colors.neutral[50],
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily,
              "& .MuiSelect-select": {
                padding: "8px 12px",
                height: "40px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary.main,
                boxShadow: `0 0 0 2px ${colors.primary.main}20`,
              },
              "& .MuiSelect-icon": {
                color: colors.neutral[400],
              },
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: borderRadius.md,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
                  "& .MuiMenuItem-root": {
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.sm,
                    fontFamily: typography.fontFamily,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.main}08 100%)`,
                    },
                    "&.Mui-selected": {
                      background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.main}15 100%)`,
                      },
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
        </FormControl>

        {/* Platform Filter */}
        <FormControl
          sx={{
            minWidth: 120,
            flexGrow: isMobile ? 1 : 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.neutral[300],
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeights.semiBold,
              fontFamily: typography.fontFamily,
              mb: spacing.xs,
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
              height: "40px",
              borderRadius: borderRadius.md,
              background: `linear-gradient(135deg, ${colors.neutral[800]}60 0%, ${colors.neutral[900]}80 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.neutral[600]}`,
              color: colors.neutral[50],
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily,
              "& .MuiSelect-select": {
                padding: "8px 12px",
                height: "40px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary.main,
                boxShadow: `0 0 0 2px ${colors.primary.main}20`,
              },
              "& .MuiSelect-icon": {
                color: colors.neutral[400],
              },
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: borderRadius.md,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
                  "& .MuiMenuItem-root": {
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.sm,
                    fontFamily: typography.fontFamily,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.main}08 100%)`,
                    },
                    "&.Mui-selected": {
                      background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.main}15 100%)`,
                      },
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
        </FormControl>

        {/* Instant Unbond Toggle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: isMobile ? 0 : "auto",
            gap: spacing.xs,
            position: "relative",
            zIndex: 2,
            p: spacing.sm,
            borderRadius: borderRadius.md,
            background: `linear-gradient(135deg, ${colors.neutral[800]}30 0%, ${colors.neutral[900]}50 100%)`,
            border: `1px solid ${colors.neutral[700]}`,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={instantUnbondOnly}
                onChange={handleToggleChange}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: colors.primary.main,
                    "&:hover": {
                      backgroundColor: `${colors.primary.main}08`,
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: `${colors.primary.main}60`,
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: colors.neutral[600],
                  },
                  "& .MuiSwitch-thumb": {
                    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                  fontFamily: typography.fontFamily,
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
                  backgroundColor: colors.neutral[800],
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: borderRadius.sm,
                  backdropFilter: "blur(10px)",
                  fontSize: typography.fontSize.xs,
                  fontFamily: typography.fontFamily,
                },
                "& .MuiTooltip-arrow": {
                  color: colors.neutral[800],
                  "&::before": {
                    border: `1px solid ${colors.neutral[700]}`,
                  },
                },
              },
            }}
          >
            <InfoOutlinedIcon
              sx={{
                color: colors.primary.main,
                fontSize: "18px",
                cursor: "help",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.primary.light,
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
