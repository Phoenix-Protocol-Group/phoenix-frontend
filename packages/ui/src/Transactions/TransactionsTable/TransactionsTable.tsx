import {
  ArrowDownward,
  ArrowRightAlt,
  ExpandMore,
  ManageSearch,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Button as PhoButton } from "../../Button/Button";
import {
  TransactionsTableProps,
  TransactionTableEntryProps,
} from "@phoenix-protocol/types";
import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const BoxStyle = {
  p: 2,
  borderRadius: "8px",
  border: "1px solid #2C2C31",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
};

const FilterMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "0.75rem",
                      alignItems: "center",
                      color: "rgba(255, 255, 255, 0.70)",
                      fontFamily: "Ubuntu",
                      fontSize: "0.875rem",
                      fontStyle: "normal",
                      fontWeight: 400,
                      borderRadius: "1rem",
                      border: "1px solid #2D303A",
                    },
                    "& legend": {
                      display: "none",
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
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "0.75rem",
                      alignItems: "center",
                      color: "rgba(255, 255, 255, 0.70)",
                      fontFamily: "Ubuntu",
                      fontSize: "0.875rem",
                      fontStyle: "normal",
                      fontWeight: 400,
                      borderRadius: "1rem",
                      border: "1px solid #2D303A",
                    },
                    "& legend": {
                      display: "none",
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
              sx={{
                marginTop: "0.5rem",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  border: "1px solid #2D303A",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
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
                  border: "1px solid #2D303A",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
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
              sx={{
                marginTop: "0.5rem",
                "& .MuiInputBase-root": {
                  margin: 0,
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.70)",
                  fontFamily: "Ubuntu",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  borderRadius: "1rem",
                  border: "1px solid #2D303A",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
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
                  border: "1px solid #2D303A",
                  "& .MuiOutlinedInput-input": {
                    padding: "0.75rem",
                    margin: 0,
                  },
                },
                "& legend": {
                  display: "none",
                },
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: "0.75rem" }} />
        <PhoButton label={"Apply"} />
        <Box sx={{ width: "100%", mt: "0.5rem" }}>
          <PhoButton
            sx={{ width: "100%" }}
            type="secondary"
            fullWidth
            label={"Reset"}
          />
        </Box>
      </Menu>
    </div>
  );
};

const TransactionsEntry = (props: TransactionTableEntryProps) => {
  return (
    <Box sx={{ ...BoxStyle, mb: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: "16px",
              border:
                props.type === "Sent" ? "1px solid #F22" : "1px solid #5BFF22",
              background:
                props.type === "Sent"
                  ? "rgba(255, 34, 34, 0.20)"
                  : "rgba(91, 255, 34, 0.20)",
              color: props.type === "Sent" ? "#F22" : "#5BFF22",
              fontSize: "12px",
              py: 0.5,
              display: "inline-flex",
              width: "88px",
              justifyContent: "center",
            }}
          >
            {props.type}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {props.assets.map((asset, index) => (
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {asset.name}{" "}
                {index !== props.assets.length - 1 && (
                  <ArrowRightAlt sx={{ fontSize: "24px" }} />
                )}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
            }}
          >
            {props.tradeSize}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            {props.date}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton>
            <ManageSearch sx={{ fontSize: "20px" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

const TableHeader = ({ label, active }: { label: string; active: boolean }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: "10px",
        lineHeight: "200%",
        fontWeight: "700",
        textTransform: "uppercase",
        opacity: active ? "1" : "0.6",
        mr: 0.5,
      }}
    >
      {label}
    </Typography>
    {active ? (
      <ArrowDownward sx={{ fontSize: "14px" }} />
    ) : (
      <SwapVert sx={{ fontSize: "14px", opacity: "0.6" }} />
    )}
  </Box>
);

const TransactionsTable = (props: TransactionsTableProps) => {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      }}
    >
      <Box sx={{ display: "flex", mb: 2 }}>
        <Input
          placeholder="Search"
          onChange={(e: any) => setSearchValue(e.target.value)}
          sx={{
            flex: 1,
            borderRadius: "8px",
            border: "1px solid #2C2C31",
            background: "#2C2C31",
            padding: "4px 16px",
            lineHeight: "18px",
            fontSize: "13px",
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <img style={{ marginRight: "8px" }} src="/MagnifyingGlass.svg" />
          }
        />
        <FilterMenu />
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2 }}>
        <Grid container>
          <Grid item xs={2}>
            <TableHeader label="Trade type" active={false} />
          </Grid>
          <Grid item xs={3}>
            <TableHeader label="Asset" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Trade Size" active={true} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Trade Value" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Date" active={false} />
          </Grid>
          <Grid item xs={1}>
            <TableHeader label="Actions" active={false} />
          </Grid>
        </Grid>
      </Box>
      <Box>
        {props.entries.map((entry, index) => (
          <TransactionsEntry
            type={entry.type}
            assets={entry.assets}
            tradeSize={entry.tradeSize}
            tradeValue={entry.tradeValue}
            date={entry.date}
          />
        ))}
      </Box>
    </Box>
  );
};

export { TransactionsTable };
