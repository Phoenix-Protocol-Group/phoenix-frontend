import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
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
import { HelpCenterOutlined } from "@mui/icons-material";

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
  };

  if (!isMobile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root.Mui-selected": {
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "white",
            },
            "& .MuiTab-root": {
              marginBottom: "1.5rem",
            },
          }}
          TabIndicatorProps={{
            style: {
              background:
                "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
            },
          }}
        >
          <Tab
            label="All Assets"
            {...a11yProps(0)}
            onClick={() => setCategory("All")}
          />
          {categories.map((cat, index) => (
            <Tab
              key={index}
              label={cat}
              {...a11yProps(index + 1)}
              onClick={() => setCategory(cat)}
            />
          ))}
        </Tabs>
        <Box>
          <TextField
            id="search"
            type="search"
            value={searchTerm}
            placeholder="Search"
            sx={{
              color: "white",
              "&::placeholder": {
                color: "white",
                opacity: 0.6,
                fontSize: "0.8125rem!important",
              },
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "white!important",
                fontSize: "0.8125rem",
                opacity: 0.6,
                textAlign: "center",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                opacity: 0.6,
                borderRadius: "16px",
                "&:hover fieldset": {
                  border: "1px solid #E2621B!important",
                },
                "&:focus-within fieldset, &:focus-visible fieldset": {
                  border: "2px solid #E2621B!important",
                  color: "white!important",
                },
              },
            }}
          />
          <FormControl sx={{ ml: 1, minWidth: 120 }}>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as "highest" | "lowest")}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ borderRadius: "16px", opacity: 0.6 }}
            >
              <MenuItem value={"highest"}>Highest Balance</MenuItem>
              <MenuItem value={"lowest"}>Lowest Balance</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  } else {
    return (
      <Grid container p={0} spacing={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as string)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                borderRadius: "16px",
                opacity: 0.6,
                fontSize: "0.8125rem!important",
                lineHeight: "1.125rem",
              }}
            >
              <MenuItem value={"All"}>All Assets</MenuItem>
              {categories.map((cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          mb={2}
          sx={{
            display: "flex",
          }}
        >
          <TextField
            id="search"
            type="search"
            value={searchTerm}
            placeholder="Search"
            sx={{
              color: "white",
              width: "100%",
              "&::placeholder": {
                color: "white",
                opacity: 0.6,
                fontSize: "0.8125rem!important",
                lineHeight: "1.125rem",
              },
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                opacity: 0.6,
                width: "100%",
                borderRadius: "16px",
                "&:hover fieldset": {
                  border: "1px solid #E2621B!important",
                },
                "&:focus-within fieldset, &:focus-visible fieldset": {
                  border: "2px solid #E2621B!important",
                  color: "white!important",
                },
              },
            }}
          />
          <FormControl sx={{ ml: 1, minWidth: 150 }}>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as "highest" | "lowest")}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                borderRadius: "16px",
                opacity: 0.6,
                color: "white",
              }}
            >
              <MenuItem value={"highest"}>Highest Balance</MenuItem>
              <MenuItem value={"lowest"}>Lowest Balance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
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

  // Sync favorites with localStorage
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
          borderTop: "1px solid #F0F3F61A",
          py: "1.3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ maxWidth: "24px" }} component={"img"} src={icon} />
          <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
            {name}
          </Typography>
          {name !== "XLM" && (
            <HelpCenterOutlined
              sx={{ fontSize: "1.125rem", cursor: "pointer" }}
              onClick={() => onTokenClick(contractId)}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
            {amount}
          </Typography>
          <Typography sx={{ color: "#808191", ml: "0.5rem" }}>
            ${(usdValue * amount).toFixed(2)}
          </Typography>
          {!favorites.includes(name) ? (
            <Tooltip title="Add to favorites">
              <IconButton onClick={() => setFavorites([...favorites, name])}>
                <StarBorderIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Remove from favorites">
              <IconButton
                onClick={() =>
                  setFavorites(favorites.filter((f) => f !== name))
                }
              >
                <StarIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
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
  const largerThanMd = useMediaQuery(theme.breakpoints.up("xl"));

  // Filter, search, and sort tokens
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
        p: "1.6rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
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
          maxHeight: "19rem",
          mt: { xs: 2, md: 0 },
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E2491A",
            borderRadius: "8px",
          },
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
