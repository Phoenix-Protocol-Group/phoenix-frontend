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
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import {
  FilterAndTabPanelProps,
  ListItemProps,
  WalletBalanceTableProps,
} from "@phoenix-protocol/types";
import { HelpCenter, HelpCenterOutlined } from "@mui/icons-material";

function a11yProps(index: number) {
  return {
    id: `category-tab-${index}`,
    "aria-controls": `category-tabpanel-${index}`,
  };
}

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
            {...a11yProps(10)}
            onClick={() => setCategory("All")}
          />
          {categories.map((cat, index) => (
            <Tab
              key={index}
              label={cat}
              {...a11yProps(index)}
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
              onChange={(e) =>
                setCategory(e.target.value as "highest" | "lowest")
              }
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
                width: "100%",
                fontSize: "0.8125rem",
                lineHeight: "1.125rem",
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
                fontSize: "0.8125rem",
                lineHeight: "1.125rem",
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

const ListItem = ({
  token: { name, icon, usdValue, amount, contractId },
  onTokenClick,
}: ListItemProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("favorites")!) || [];
    if (items) {
      setFavorites(items);
    }
  }, []);

  return (
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
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: "1.125rem",
          }}
        >
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
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: "1.125rem",
          }}
        >
          {amount}
        </Typography>
        <Typography
          sx={{
            color: "#808191",
            fontWeight: 500,
            fontSize: "0.75rem",
            lineHeight: "1rem",
            ml: "0.5rem",
          }}
        >
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
              onClick={() => setFavorites(favorites.filter((f) => f !== name))}
            >
              <StarIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

const scrollbarStyles = {
  /* Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "#E2491A #1B1B1B",

  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    width: "4px",
  },

  "&::-webkit-scrollbar-track": {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E2491A",
    borderRadius: "8px",
  },
};

const WalletBalanceTable = ({
  tokens,
  onTokenClick,
}: WalletBalanceTableProps) => {
  const [sort, setSort] = useState("highest" as "highest" | "lowest");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = tokens.map((token) => token.category);
  const uniqueCategories = [...new Set(categories)];

  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Box
      sx={{
        borderRadius: "24px",
        p: "1.6rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        height: largerThenMd ? "26rem" : "auto",
        mb: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <FilterAndTabPanel
        searchTerm={searchTerm}
        category={category}
        categories={uniqueCategories}
        setCategory={setCategory}
        setSearchTerm={setSearchTerm}
        setSort={setSort}
        sort={sort}
        isMobile={!largerThenMd}
      />
      <Box
        sx={{
          overflow: "auto",
          maxHeight: "19rem",
          mt: { xs: 2, md: 0 },
          ...scrollbarStyles,
        }}
      >
        {tokens.length ? (
          [...tokens]
            .filter(
              (token) => token.category === category || category === "All"
            )
            .filter((token) =>
              token.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
              const aTrueValue = a.amount * a.usdValue;
              const bTrueValue = b.amount * b.usdValue;

              if (sort === "highest") {
                return bTrueValue - aTrueValue;
              } else {
                return aTrueValue - bTrueValue;
              }
            })
            .map((token, index) => (
              <ListItem token={token} onTokenClick={onTokenClick} key={index} />
            ))
        ) : (
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pt: 1,
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
