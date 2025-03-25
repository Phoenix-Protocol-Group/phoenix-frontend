import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  Grid,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import {
  FilterAndTabPanelProps,
  ListItemProps,
  WalletBalanceTableProps,
} from "@phoenix-protocol/types";
import {
  ArrowRightAlt,
  HelpCenterOutlined,
  InfoOutlined,
  Lock,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/system";

/**
 * Accessibility properties for tabs.
 */
function a11yProps(index: number) {
  return {
    id: `category-tab-${index}`,
    "aria-controls": `category-tabpanel-${index}`,
  };
}

/**
 * FilterAndTabPanel
 */
const FilterAndTabPanel = ({
  categories,
  searchTerm,
  sort,
  category,
  setCategory,
  setSearchTerm,
  setSort,
  isMobile,
}: FilterAndTabPanelProps) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCategory(newValue === 0 ? "All" : categories[newValue - 1]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "16px",
        gap: isMobile ? 0 : "24px",
      }}
    >
      <Grid container spacing={isMobile ? 2 : 3} alignItems="center">
        {/* Title */}
        <Grid item xs={12} md={2}>
          <Typography
            sx={{
              color: "var(--neutral-50, #FAFAFA)",
              fontFamily: "Ubuntu",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Assets
          </Typography>
        </Grid>

        {/* Tabs, Search, and Sort */}
        <Grid
          item
          xs={12}
          md={10}
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden",
            gap: isMobile ? 2 : 3,
          }}
        >
          {/* Tabs for Filtering */}
          {isMobile ? (
            <FormControl fullWidth>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                sx={{
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--neutral-900, #171717)",
                  border: "1px solid var(--neutral-700, #404040)",
                  color: "var(--neutral-300, #D4D4D4)",
                  fontSize: "12px",
                  "& .MuiSelect-select": {
                    fontSize: "12px",
                    lineHeight: "16px",
                    padding: "8px 12px",
                  },
                }}
              >
                <MenuItem value={"All"}>All</MenuItem>
                {categories.map((cat, index) => (
                  <MenuItem key={index} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root.Mui-selected": {
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--neutral-50, #FAFAFA)",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  height: "40px",
                  minHeight: "40px",
                  lineHeight: "40px",
                  alignItems: "center",
                  flexShrink: 0,
                  color: "var(--neutral-300, #D4D4D4)",
                },
                maxWidth: "50%",
              }}
              TabIndicatorProps={{
                style: {
                  background:
                    "linear-gradient(137deg, #F97316 0%, #F97316 17.08%, #F97316 42.71%, #F97316 100%)",
                },
              }}
            >
              <Tab label="All" {...a11yProps(0)} />
              {categories.map((cat, index) => (
                <Tab key={index} label={cat} {...a11yProps(index + 1)} />
              ))}
            </Tabs>
          )}

          {/* Search Bar */}
          <TextField
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: "180px",
              height: "40px",
              borderRadius: "12px",
              background: "var(--neutral-900, #171717)",
              lineHeight: "16px",
              fontSize: "12px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                padding: "0 8px",
                "& input": {
                  padding: "8px 0",
                  fontSize: "12px",
                  color: "var(--neutral-300, #D4D4D4)",
                },
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-500, #F97316)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary-500, #F97316)",
                },
              },
              "& .MuiInputAdornment-root img": {
                marginRight: "8px",
              },
              "&::placeholder": {
                color: "var(--neutral-400, #A3A3A3)",
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src="/MagnifyingGlass.svg" alt="search" />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort Dropdown */}
          <FormControl
            sx={{
              minWidth: 150,
              height: "40px",
              flexGrow: 0,
              flexShrink: 1,
            }}
          >
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as "highest" | "lowest")}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                height: "40px",
                borderRadius: "12px",
                background: "var(--neutral-900, #171717)",
                border: "1px solid var(--neutral-700, #404040)",
                padding: "0 12px",
                color: "var(--neutral-300, #D4D4D4)",
                fontSize: "12px",
                "& .MuiSelect-select": {
                  fontSize: "12px",
                  lineHeight: "16px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value={"highest"}>Highest Balance</MenuItem>
              <MenuItem value={"lowest"}>Lowest Balance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * ListItem
 */
const ListItem = ({
  token: { name, icon, usdValue, amount, contractId },
  onTokenClick,
  hasVesting,
  onVestingClick,
}: ListItemProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "8px",
          background: "var(--neutral-900, #171717)",
          border: "1px solid var(--neutral-700, #404040)",
          mb: 2,
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={() => onTokenClick(contractId)}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={6} md={3} display="flex" alignItems="center">
            <Box
              component={"img"}
              src={icon}
              sx={{ width: "24px", height: "24px", mr: 1 }}
            />
            <Typography
              sx={{
                color: "var(--neutral-50, #FAFAFA)",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {name}
            </Typography>
            {/* If Name = PHO and has vesting, show a lock button */}
            {name === "PHO" && hasVesting && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginLeft: "4px",
                }}
              >
                <Tooltip
                  title="Vesting Schedule"
                  arrow
                  placement="top"
                  sx={{
                    "& .MuiTooltip-arrow": {
                      color: "var(--primary-500, #F97316)",
                    },
                    "& .MuiTooltip-tooltip": {
                      backgroundColor: "var(--neutral-800, #262626)",
                      color: "var(--neutral-300, #D4D4D4)",
                      fontSize: "10px",
                    },
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: 15,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onVestingClick}
                  >
                    <Lock
                      sx={{
                        color: "var(--primary-500, #F97316)",
                        fontSize: "16px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "var(--primary-500, #F97316)",
                        fontSize: "10px",
                      }}
                    >
                      Vesting
                    </Typography>
                  </motion.div>
                </Tooltip>
              </Box>
            )}
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                color: "var(--neutral-50, #FAFAFA)",
                fontSize: "14px",
              }}
            >
              {amount}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                color: "var(--neutral-300, #D4D4D4)",
                fontSize: "14px",
                opacity: 1,
              }}
            >
              ${(usdValue * amount).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} display="flex" justifyContent="flex-end">
            {!favorites.includes(name) ? (
              <IconButton onClick={() => setFavorites([...favorites, name])}>
                <StarBorderIcon sx={{ color: "var(--neutral-300, #D4D4D4)" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={() =>
                  setFavorites(favorites.filter((f) => f !== name))
                }
              >
                <StarIcon sx={{ color: "var(--primary-500, #F97316)" }} />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

/**
 * WalletBalanceTable
 */
const WalletBalanceTable = ({
  tokens,
  onTokenClick,
  hasVesting,
  onVestingClick,
}: WalletBalanceTableProps) => {
  const [sort, setSort] = useState("highest" as "highest" | "lowest");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => [...new Set(tokens.map((token) => token.category))],
    [tokens]
  );

  const theme = useTheme();
  const largerThanMd = useMediaQuery(theme.breakpoints.up("md"));

  const filteredTokens = useMemo(() => {
    const filtered = tokens.filter(
      (token) => token.category === category || category === "All"
    );
    const searched = filtered.filter((token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sorted = searched.sort((a, b) => {
      const aValue = a.amount * a.usdValue;
      const bValue = b.amount * b.usdValue;
      return sort === "highest" ? bValue - aValue : aValue - bValue;
    });
    return sorted;
  }, [tokens, category, searchTerm, sort]);

  return (
    <Box
      sx={{
        borderRadius: "16px",
        height: largerThanMd ? "26rem" : "auto",
        mb: { xs: 2, md: 0 },
      }}
    >
      <FilterAndTabPanel
        searchTerm={searchTerm}
        category={category}
        categories={categories}
        setCategory={setCategory}
        setSearchTerm={setSearchTerm}
        setSort={setSort}
        sort={sort}
        isMobile={!largerThanMd}
      />
      <Box
        sx={{
          overflow: "auto",
          maxHeight: largerThanMd ? "19rem" : "auto",
          mt: { xs: 2, md: 0 },
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--primary-500, #F97316)",
            borderRadius: "8px",
          },
          // Styles for Firefox
          scrollbarWidth: "thin",
          scrollbarColor:
            "var(--primary-500, #F97316) var(--neutral-800, #262626)",
        }}
      >
        {filteredTokens.length ? (
          filteredTokens.map((token, index) => (
            <ListItem
              token={token}
              onTokenClick={onTokenClick}
              key={index}
              hasVesting={hasVesting}
              onVestingClick={onVestingClick}
            />
          ))
        ) : (
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)",
              fontSize: "14px",
              textAlign: "center",
              pt: 2,
            }}
          >
            Looks like you haven't acquired any tokens.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default WalletBalanceTable;
