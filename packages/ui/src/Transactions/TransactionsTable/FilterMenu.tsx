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
      <Button
        onClick={handleClick}
        type="secondary"
        label="Filter"
        sx={{
          padding: `${spacing.xs} ${spacing.sm}`,
          fontSize: typography.fontSize.sm,
        }}
      />

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
            padding: `${spacing.sm} ${spacing.lg}`,
            flexDirection: "column",
            gap: spacing.lg,
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.neutral[700]}`,
            background: colors.neutral[800],
            color: colors.neutral[300],
            boxShadow: shadows.tooltip,
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
                  background: colors.neutral[900],
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[300],
                  padding: "8px 12px",
                  borderRadius: borderRadius.lg,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
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
                  background: colors.neutral[900],
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[300],
                  padding: "8px 12px",
                  borderRadius: borderRadius.lg,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
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
                  background: colors.neutral[900],
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[300],
                  padding: "8px 12px",
                  borderRadius: borderRadius.lg,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
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
                  background: colors.neutral[900],
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[300],
                  padding: "8px 12px",
                  borderRadius: borderRadius.lg,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  outline: "none",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: spacing.sm, mt: spacing.md }}>
          <Button label="Apply" onClick={updateFilters} type="primary" />
          <Button label="Reset" onClick={resetFilters} type="secondary" />
        </Box>
      </Menu>
    </div>
  );
};

export default FilterMenu;
