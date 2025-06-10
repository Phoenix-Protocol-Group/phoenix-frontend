import React, { useState } from "react";
import { Box, Menu, Typography, Divider } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { FilterMenuProps } from "@phoenix-protocol/types";
import { Button } from "../../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../Theme/styleConstants";

const FilterMenu = ({ activeFilters, applyFilters }: FilterMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Set State for filters
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: activeFilters.dateRange.from,
    to: activeFilters.dateRange.to,
  });
  const [tradeSize, setTradeSize] = React.useState<{
    from: number | undefined;
    to: number | undefined;
  }>({
    from: activeFilters.tradeSize.from,
    to: activeFilters.tradeSize.to,
  });
  const [tradeValue, setTradeValue] = React.useState<{
    from: number | undefined;
    to: number | undefined;
  }>({
    from: activeFilters.tradeValue.from,
    to: activeFilters.tradeValue.to,
  });

  // React useEffect to update filters
  React.useEffect(() => {
    setDateRange({
      from: activeFilters.dateRange.from,
      to: activeFilters.dateRange.to,
    });
    setTradeSize({
      from: activeFilters.tradeSize.from,
      to: activeFilters.tradeSize.to,
    });
    setTradeValue({
      from: activeFilters.tradeValue.from,
      to: activeFilters.tradeValue.to,
    });
  }, [activeFilters]);

  // Function to update new filters
  const updateFilters = () => {
    applyFilters({
      dateRange,
      tradeSize,
      tradeValue,
    });
    handleClose();
  };

  // Function to reset filters
  const resetFilters = () => {
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setTradeSize({
      from: undefined,
      to: undefined,
    });
    setTradeValue({
      from: undefined,
      to: undefined,
    });
    applyFilters({
      dateRange: {
        from: undefined,
        to: undefined,
      },
      tradeSize: {
        from: undefined,
        to: undefined,
      },
      tradeValue: {
        from: undefined,
        to: undefined,
      },
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: spacing.xs,
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.neutral[700]}`,
          background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
          color: colors.neutral[300],
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeights.medium,
          fontFamily: typography.fontFamily,
          cursor: "pointer",
          transition: "all 0.3s ease",
          minWidth: "80px",
          justifyContent: "center",
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}08 100%)`,
            border: `1px solid ${colors.primary.main}30`,
            color: colors.neutral[100],
            transform: "translateY(-1px)",
            boxShadow: `0 4px 12px ${colors.primary.main}20`,
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        🔍 Filter
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiMenu-paper": {
            display: "flex",
            padding: spacing.lg,
            flexDirection: "column",
            gap: spacing.lg,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.neutral[700]}`,
            background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
            color: colors.neutral[300],
            boxShadow: `0 20px 40px ${colors.neutral[900]}60, 0 0 0 1px ${colors.primary.main}20`,
            backdropFilter: "blur(20px)",
            minWidth: "320px",
            mt: spacing.sm,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: spacing.sm,
            gap: spacing.sm,
          }}
        >
          <Box flex={1}>
            <Typography
              sx={{
                color: colors.neutral[400],
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.regular,
                lineHeight: "140%",
                opacity: 0.6,
              }}
            >
              From
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{
                  "& .MuiTextField-root": {
                    minWidth: "0 !important",
                  },
                }}
              >
                <DatePicker
                  value={dateRange.from ? dayjs(dateRange.from) : undefined}
                  onChange={(newValue) =>
                    setDateRange({
                      ...dateRange,
                      from: newValue ? newValue.toDate() : undefined,
                    })
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      alignItems: "center",
                      color: colors.neutral[300],
                      fontFamily: typography.fontFamily,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.regular,
                      borderRadius: borderRadius.lg,
                      minWidth: "unset",
                      background: colors.neutral[900],
                      border: `1px solid ${colors.neutral[700]}`,
                    },
                    "& legend": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box flex={1}>
            <Typography
              sx={{
                color: colors.neutral[400],
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.regular,
                lineHeight: "140%",
                opacity: 0.6,
              }}
            >
              To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{
                  "& .MuiTextField-root": {
                    minWidth: "0 !important",
                  },
                }}
              >
                <DatePicker
                  value={dateRange.to ? dayjs(dateRange.to) : undefined}
                  onChange={(newValue: dayjs.Dayjs | null) =>
                    setDateRange({
                      ...dateRange,
                      to: newValue === null ? undefined : newValue.toDate(),
                    })
                  }
                  disableFuture
                  slotProps={{
                    field: { clearable: true },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      alignItems: "center",
                      color: colors.neutral[300],
                      fontFamily: typography.fontFamily,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.regular,
                      borderRadius: borderRadius.lg,
                      minWidth: "unset",
                      background: colors.neutral[900],
                      border: `1px solid ${colors.neutral[700]}`,
                    },
                    "& .MuiTextField-root": {
                      minWidth: "0 !important",
                    },
                    "& legend": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Divider sx={{ my: spacing.sm, background: colors.neutral[700] }} />

        {/* Trade Size Filter */}
        <Box>
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.bold,
              lineHeight: "140%",
              mb: 1,
            }}
          >
            Trade Size
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Box flex={1}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.regular,
                  lineHeight: "140%",
                  opacity: 0.6,
                }}
              >
                From
              </Typography>
              <input
                type="number"
                value={tradeSize.from !== undefined ? tradeSize.from : ""}
                onChange={(e) =>
                  setTradeSize({
                    ...tradeSize,
                    from:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="Min"
                style={{
                  width: "100%",
                  background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[200],
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${colors.primary.main}50`;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${colors.neutral[700]}`;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.regular,
                  lineHeight: "140%",
                  opacity: 0.6,
                }}
              >
                To
              </Typography>
              <input
                type="number"
                value={tradeSize.to !== undefined ? tradeSize.to : ""}
                onChange={(e) =>
                  setTradeSize({
                    ...tradeSize,
                    to:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="Max"
                style={{
                  width: "100%",
                  background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[200],
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${colors.primary.main}50`;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${colors.neutral[700]}`;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: spacing.sm, background: colors.neutral[700] }} />

        {/* Trade Value Filter */}
        <Box>
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.bold,
              lineHeight: "140%",
              mb: 1,
            }}
          >
            Trade Value (USD)
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Box flex={1}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.regular,
                  lineHeight: "140%",
                  opacity: 0.6,
                }}
              >
                From
              </Typography>
              <input
                type="number"
                value={tradeValue.from !== undefined ? tradeValue.from : ""}
                onChange={(e) =>
                  setTradeValue({
                    ...tradeValue,
                    from:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="Min"
                style={{
                  width: "100%",
                  background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[200],
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${colors.primary.main}50`;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${colors.neutral[700]}`;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.regular,
                  lineHeight: "140%",
                  opacity: 0.6,
                }}
              >
                To
              </Typography>
              <input
                type="number"
                value={tradeValue.to !== undefined ? tradeValue.to : ""}
                onChange={(e) =>
                  setTradeValue({
                    ...tradeValue,
                    to:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="Max"
                style={{
                  width: "100%",
                  background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[200],
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.border = `1px solid ${colors.primary.main}50`;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `1px solid ${colors.neutral[700]}`;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: spacing.sm, mt: spacing.lg }}>
          <Box
            component="button"
            onClick={updateFilters}
            sx={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.primary.main}`,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
              color: colors.neutral[50],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              fontFamily: typography.fontFamily,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px ${colors.primary.main}40`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Apply Filters
          </Box>
          <Box
            component="button"
            onClick={resetFilters}
            sx={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.neutral[700]}`,
              background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
              color: colors.neutral[300],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              fontFamily: typography.fontFamily,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[750]} 100%)`,
                border: `1px solid ${colors.neutral[600]}`,
                color: colors.neutral[200],
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Reset
          </Box>
        </Box>
      </Menu>
    </div>
  );
};

export default FilterMenu;
