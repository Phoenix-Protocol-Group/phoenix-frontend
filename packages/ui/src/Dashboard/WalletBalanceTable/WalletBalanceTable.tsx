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
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/system";

/**
 * Accessibility properties for tabs.
 * @param {number} index - The index of the tab.
 * @returns {object} - Accessibility properties for the tab.
 */
function a11yProps(index: number) {
  return {
    id: `category-tab-${index}`,
    "aria-controls": `category-tabpanel-${index}`,
  };
}

/**
 * FilterAndTabPanel
 * Handles category selection, search, and sorting for the wallet table.
 * @param {FilterAndTabPanelProps} props - Filter and tab panel props.
 * @returns {JSX.Element}
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
        gap: isMobile ? 0 : "24px", // Added gap for larger screens
      }}
    >
      <Grid container spacing={isMobile ? 2 : 3} alignItems="center">
        {/* Title */}
        <Grid item xs={12} md={2}>
          <Typography
            sx={{
              color: "var(--Secondary-S2, #FFF)",
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
            gap: isMobile ? 2 : 3, // Increased gap between elements for larger screens
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
                  height: "48px",
                  borderRadius: "16px",
                  background: "#1D1F21",
                  border: "1px solid #2D303A",
                  color: "#FFF",
                  "& .MuiSelect-select": {
                    fontSize: "13px",
                    lineHeight: "18px",
                    padding: "8px 16px",
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
                  color: "white",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  height: "48px",
                  minHeight: "48px",
                  lineHeight: "48px",
                  alignItems: "center",
                  flexShrink: 0,
                },
                maxWidth: "50%",
              }}
              TabIndicatorProps={{
                style: {
                  background:
                    "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
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
              height: "48px",
              borderRadius: "16px",
              background: "#1D1F21",
              lineHeight: "18px",
              fontSize: "13px",
              "& .MuiOutlinedInput-root": {
                height: "48px",
                padding: "0 12px",
                "& input": {
                  padding: "12px 0",
                },
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "#E2621B",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E2621B",
                },
              },
              "& .MuiInputAdornment-root img": {
                marginRight: "8px",
              },
              "&::placeholder": {
                color: "#FFF",
                opacity: 0.6,
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
              height: "48px",
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
                height: "48px",
                borderRadius: "16px",
                background: "#1D1F21",
                border: "1px solid #2D303A",
                padding: "0 12px",
                color: "#FFF",
                "& .MuiSelect-select": {
                  fontSize: "13px",
                  lineHeight: "18px",
                  height: "48px",
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
 * Represents a single token in the wallet balance table.
 * Supports adding/removing favorites and displaying token details.
 * @param {ListItemProps} props - Props for the list item.
 * @returns {JSX.Element}
 */
const ListItem = ({
  token: { name, icon, usdValue, amount, contractId },
  onTokenClick,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "8px",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          mb: 2,
        }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={6} md={3} display="flex" alignItems="center">
            <Box
              component={"img"}
              src={icon}
              sx={{ width: "24px", height: "24px", mr: 2 }}
            />
            <Typography
              sx={{ color: "#FFF", fontWeight: 700, fontSize: "14px" }}
            >
              {name}
            </Typography>
            {name !== "XLM" && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                <Tooltip
                  title="More information"
                  arrow
                  placement="top"
                  sx={{
                    "& .MuiTooltip-arrow": {
                      color: "#E2491A",
                    },
                    "& .MuiTooltip-tooltip": {
                      backgroundColor: "#1D1F21",
                      color: "#FFF",
                      fontSize: "12px",
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
                  >
                    <InfoOutlined
                      sx={{
                        color: "#E2621B",
                        fontSize: "20px",
                      }}
                      onClick={() => onTokenClick(contractId)}
                    />
                  </motion.div>
                </Tooltip>
              </Box>
            )}
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ color: "#FFF", fontSize: "14px" }}>
              {amount}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ color: "#FFF", fontSize: "14px", opacity: 0.6 }}>
              ${(usdValue * amount).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} display="flex" justifyContent="flex-end">
            {!favorites.includes(name) ? (
              <IconButton onClick={() => setFavorites([...favorites, name])}>
                <StarBorderIcon sx={{ color: "#FFF" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={() =>
                  setFavorites(favorites.filter((f) => f !== name))
                }
              >
                <StarIcon sx={{ color: "#FFF" }} />
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
 * Displays a list of tokens with search, sorting, and filtering capabilities.
 * Includes favorite functionality and modern styling.
 * @param {WalletBalanceTableProps} props - Props for the wallet balance table.
 * @returns {JSX.Element}
 */
const WalletBalanceTable = ({
  tokens,
  onTokenClick,
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
        borderRadius: "24px",
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
            backgroundColor: "#E2491A",
            borderRadius: "8px",
          },
          // Styles for Firefox
          scrollbarWidth: "thin", // Thin scrollbar width
          scrollbarColor: "#E2491A #2C2C31", // Thumb color and track color
        }}
      >
        {filteredTokens.length ? (
          filteredTokens.map((token, index) => (
            <ListItem token={token} onTokenClick={onTokenClick} key={index} />
          ))
        ) : (
          <Typography
            sx={{
              color: "#FFF",
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
