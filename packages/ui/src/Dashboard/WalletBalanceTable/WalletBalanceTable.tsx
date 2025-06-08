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
import {
  borderRadius,
  colors,
  spacing,
  typography,
  cardStyles,
} from "../../Theme/styleConstants";

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
        marginBottom: spacing.lg,
        gap: isMobile ? spacing.sm : spacing.lg,
      }}
    >
      <Grid container spacing={isMobile ? 2 : 3} alignItems="center">
        {/* Title */}
        <Grid item xs={12} md={2}>
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeights.bold,
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[300]} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: "180px",
              height: "40px",
              borderRadius: borderRadius.md,
              background: `linear-gradient(135deg, ${colors.neutral[800]}60 0%, ${colors.neutral[900]}80 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.neutral[600]}`,
              "& .MuiOutlinedInput-root": {
                height: "40px",
                padding: "0 12px",
                borderRadius: borderRadius.md,
                "& input": {
                  padding: "8px 0",
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[50],
                  fontFamily: typography.fontFamily,
                  "&::placeholder": {
                    color: colors.neutral[400],
                    opacity: 0.8,
                  },
                },
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: colors.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.primary.main,
                  boxShadow: `0 0 0 2px ${colors.primary.main}20`,
                },
              },
              "& .MuiInputAdornment-root": {
                "& img": {
                  marginRight: spacing.xs,
                  filter: "opacity(0.7)",
                },
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
              inputProps={{ "aria-label": "Sort options" }}
              sx={{
                height: "40px",
                borderRadius: borderRadius.md,
                background: `linear-gradient(135deg, ${colors.neutral[800]}60 0%, ${colors.neutral[900]}80 100%)`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${colors.neutral[600]}`,
                padding: "0 12px",
                color: colors.neutral[50],
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize.sm,
                "& .MuiSelect-select": {
                  fontSize: typography.fontSize.sm,
                  lineHeight: "16px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  color: colors.neutral[50],
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
  const isXLM = name === "XLM";

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
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          p: { xs: spacing.sm, sm: spacing.md },
          py: spacing.sm,
          borderRadius: borderRadius.lg,
          mb: spacing.sm,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.15)`,
          minHeight: "auto",
          "&:hover": {
            cursor: isXLM ? "default" : "pointer",
            background: !isXLM
              ? `linear-gradient(135deg, ${colors.neutral[700]}50 0%, ${colors.neutral[800]}70 100%)`
              : `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
            border: !isXLM
              ? `1px solid ${colors.primary.main}40`
              : `1px solid ${colors.neutral[700]}`,
            transform: !isXLM ? "translateY(-1px)" : "none",
            boxShadow: !isXLM
              ? `0 6px 24px rgba(0, 0, 0, 0.2)`
              : `0 4px 16px rgba(0, 0, 0, 0.15)`,
          },
          transition: "all 0.2s ease",
        }}
        onClick={!isXLM ? () => onTokenClick(contractId) : undefined}
      >
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Grid item xs={6} md={3} display="flex" alignItems="center">
            <Box
              className="token-icon"
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                border: `1px solid ${colors.primary.main}30`,
                mr: spacing.md,
                backdropFilter: "blur(10px)",
                boxShadow: `0 4px 16px ${colors.primary.main}20`,
              }}
            >
              <Box
                component={"img"}
                src={icon}
                sx={{
                  width: "24px",
                  height: "24px",
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.semiBold,
                  fontSize: typography.fontSize.md,
                  fontFamily: typography.fontFamily,
                  lineHeight: 1.2,
                }}
              >
                {name}
              </Typography>
              {/* Additional token info can go here */}
            </Box>
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
                  <Box
                    onClick={onVestingClick}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
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
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeights.medium,
                fontFamily: typography.fontFamily,
              }}
            >
              {amount}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: spacing.sm,
                py: spacing.xs,
                borderRadius: borderRadius.sm,
                background: `linear-gradient(135deg, ${colors.success.main}15 0%, ${colors.success.main}08 100%)`,
                border: `1px solid ${colors.success.main}30`,
              }}
            >
              <Typography
                sx={{
                  color: colors.success.main,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.semiBold,
                  fontFamily: typography.fontFamily,
                }}
              >
                ${(usdValue * amount).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3} display="flex" justifyContent="flex-end">
            <Box>
              {!favorites.includes(name) ? (
                <IconButton
                  onClick={() => setFavorites([...favorites, name])}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.neutral[700]}40 0%, ${colors.neutral[800]}60 100%)`,
                    border: `1px solid ${colors.neutral[600]}`,
                    borderRadius: borderRadius.md,
                    width: 36,
                    height: 36,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                      border: `1px solid ${colors.primary.main}40`,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <StarBorderIcon
                    sx={{
                      color: colors.neutral[300],
                      fontSize: "18px",
                      transition: "all 0.2s ease",
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() =>
                    setFavorites(favorites.filter((f) => f !== name))
                  }
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary.main}30 0%, ${colors.primary.main}20 100%)`,
                    border: `1px solid ${colors.primary.main}50`,
                    borderRadius: borderRadius.md,
                    width: 36,
                    height: 36,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${colors.primary.main}40 0%, ${colors.primary.main}30 100%)`,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <StarIcon
                    sx={{
                      color: colors.primary.main,
                      fontSize: "18px",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </IconButton>
              )}
            </Box>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          borderRadius: borderRadius.xl,
          height: largerThanMd ? "24rem" : "auto",
          mb: { xs: spacing.md, md: 0 },
          background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.primary.main}60, transparent)`,
            zIndex: 1,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}40`,
            boxShadow: `0 6px 24px rgba(0, 0, 0, 0.25)`,
          },
          transition: "all 0.2s ease",
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
            maxHeight: largerThanMd ? "17rem" : "auto",
            mt: { xs: spacing.md, md: 0 },
            position: "relative",
            zIndex: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: colors.neutral[800],
              borderRadius: borderRadius.md,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              "&:hover": {
                backgroundColor: colors.primary.light,
              },
            },
            // Styles for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.primary.main} ${colors.neutral[800]}`,
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
                color: colors.neutral[300],
                fontSize: typography.fontSize.md,
                fontFamily: typography.fontFamily,
                textAlign: "center",
                pt: spacing.xl,
                opacity: 0.8,
              }}
            >
              Looks like you haven't acquired any tokens.
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default WalletBalanceTable;
