import React, { useState } from "react";
import {
  Button,
  Menu,
  Box,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { Button as PhoButton } from "../../Button/Button";
import { Tune, ExpandMore, ManageSearch } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { FilterMenuProps } from "@phoenix-protocol/types";

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

  const BoxStyle = {
    p: 2,
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  };

  return (
    <div>
      <Button
        sx={{
          ...BoxStyle,
          textTransform: "none",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.6)",
          borderRadius: "8px",
          lineHeight: "20px",
          ml: 3,
          height: "38px",
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Tune sx={{ fontSize: "15px", mr: 0.5 }} />
        Filter
        <ExpandMore sx={{ fontSize: "14px", ml: 0.5 }} />
      </Button>
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
            padding: "0.75rem 1.5rem",
            flexDirection: "column",
            gap: "1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #292B2C",
            background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
            boxShadow:
              "-3px 3px 10px 0px rgba(25, 13, 1, 0.10), -12px 13px 18px 0px rgba(25, 13, 1, 0.09), -26px 30px 24px 0px rgba(25, 13, 1, 0.05), -46px 53px 28px 0px rgba(25, 13, 1, 0.02), -73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Ubuntu",
              fontSize: "0.625rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "1.25rem",
            }}
          >
            DATE RANGE
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "0.75rem",
            gap: "0.75rem",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              From
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={dateRange.from ? dayjs(dateRange.from) : undefined}
                  onChange={(newValue) =>
                    setDateRange({ ...dateRange, from: newValue.toDate() })
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      alignItems: "center",
                      color: "rgba(255, 255, 255, 0.70)",
                      fontFamily: "Ubuntu",
                      fontSize: "0.875rem",
                      fontStyle: "normal",
                      fontWeight: 400,
                      borderRadius: "1rem",
                      minWidth: {
                        xs: "unset",
                        md: "200px"
                      },
                      maxWidth: "217px"
                    },
                    "& legend": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #2D303A",
                      top: "-2px"
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={dateRange.to ? dayjs(dateRange.to) : undefined}
                  onChange={(newValue: dayjs.Dayjs | null) =>
                    setDateRange({
                      ...dateRange,
                      // @ts-ignore
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
                      color: "rgba(255, 255, 255, 0.70)",
                      fontFamily: "Ubuntu",
                      fontSize: "0.875rem",
                      fontStyle: "normal",
                      fontWeight: 400,
                      borderRadius: "1rem",
                    },
                    "& legend": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #2D303A",
                      top: "-2px"
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Divider sx={{ my: "0.75rem" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Ubuntu",
              fontSize: "0.625rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "1.25rem",
            }}
          >
            TRADE SIZE
          </Typography>
          <Button
            sx={{
              display: "flex",
              padding: "0rem 0.5rem",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #292B2C",
              background: "#1F2123",
            }}
            onClick={() => {
              setTradeSize({
                from: undefined,
                to: undefined,
              });
            }}
          >
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  d="M2.20376 3.08911C2.66696 2.28969 3.4049 1.68584 4.28018 1.39001C5.15546 1.09418 6.10843 1.12653 6.96163 1.48103C7.81484 1.83553 8.51014 2.48802 8.91806 3.31701C9.32599 4.146 9.41874 5.09499 9.17905 5.98728C8.93935 6.87957 8.38355 7.65434 7.61513 8.16733C6.84671 8.68033 5.91805 8.89658 5.00205 8.77582C4.08606 8.65507 3.24516 8.20554 2.63594 7.51093C2.02672 6.81632 1.69069 5.92398 1.69043 5.00006"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.07127 3.09519H2.1665V1.19043"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <Typography
              sx={{
                color: "var(--Secondary-S2, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Ubuntu",
                fontSize: "0.625rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "1.25rem", // 200%
                opacity: 0.6,
              }}
              onClick={() => {
                setTradeSize({
                  from: undefined,
                  to: undefined,
                });
              }}
            >
              Reset
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "0.75rem",
            gap: "0.75rem",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              From
            </Typography>

            <TextField
              value={tradeSize.from || ""}
              onChange={(e) =>
                setTradeSize({
                  ...tradeSize,
                  from: parseInt(e.target.value),
                })
              }
              sx={{
                marginTop: "0.5rem",
                width: "100%",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2D303A",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              To
            </Typography>
            <TextField
              value={tradeSize.to || ""}
              onChange={(e) =>
                setTradeSize({
                  ...tradeSize,
                  to: parseInt(e.target.value),
                })
              }
              fullWidth
              sx={{
                marginTop: "0.5rem",
                width: "100%",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2D303A",
                },
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: "0.75rem" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Ubuntu",
              fontSize: "0.625rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "1.25rem",
            }}
          >
            TRADE VALUE
          </Typography>
          <Button
            sx={{
              display: "flex",
              padding: "0rem 0.5rem",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #292B2C",
              background: "#1F2123",
            }}
            onClick={() => {
              setTradeValue({
                from: undefined,
                to: undefined,
              });
            }}
          >
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  d="M2.20376 3.08911C2.66696 2.28969 3.4049 1.68584 4.28018 1.39001C5.15546 1.09418 6.10843 1.12653 6.96163 1.48103C7.81484 1.83553 8.51014 2.48802 8.91806 3.31701C9.32599 4.146 9.41874 5.09499 9.17905 5.98728C8.93935 6.87957 8.38355 7.65434 7.61513 8.16733C6.84671 8.68033 5.91805 8.89658 5.00205 8.77582C4.08606 8.65507 3.24516 8.20554 2.63594 7.51093C2.02672 6.81632 1.69069 5.92398 1.69043 5.00006"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.07127 3.09519H2.1665V1.19043"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <Typography
              sx={{
                color: "var(--Secondary-S2, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Ubuntu",
                fontSize: "0.625rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "1.25rem", // 200%
                opacity: 0.6,
              }}
            >
              Reset
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "0.75rem",
            gap: "0.75rem",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              From
            </Typography>

            <TextField
              value={tradeValue.from || ""}
              onChange={(e) =>
                setTradeValue({
                  ...tradeValue,
                  from: parseInt(e.target.value),
                })
              }
              sx={{
                marginTop: "0.5rem",
                width: "100%",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2D303A",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 1.05rem
                opacity: 0.6,
              }}
            >
              To
            </Typography>
            <TextField
              value={tradeValue.to || ""}
              onChange={(e) =>
                setTradeValue({
                  ...tradeValue,
                  to: parseInt(e.target.value),
                })
              }
              fullWidth
              sx={{
                marginTop: "0.5rem",
                width: "100%",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.5rem 0.75rem 0.75rem 0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2D303A",
                },
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: "0.75rem" }} />
        <PhoButton label={"Apply"} onClick={() => updateFilters()} />
        <Box sx={{ width: "100%", mt: "0.5rem" }}>
          <PhoButton
            sx={{ width: "100%" }}
            type="secondary"
            fullWidth
            label={"Reset"}
            onClick={() => resetFilters()}
          />
        </Box>
      </Menu>
    </div>
  );
};

export default FilterMenu;
