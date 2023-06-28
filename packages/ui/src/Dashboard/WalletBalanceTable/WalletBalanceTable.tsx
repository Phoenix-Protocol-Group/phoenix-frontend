import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
interface WalletBalanceTableProps {
  onClick: () => void;
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FilterAndTabPanel = () => {
  const [value, setValue] = useState(0);
  const [selectValue, setSelectValue] = useState<number>(10);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [searchTerm, setSearchTerm] = useState("");

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
        <Tab label="All Assets" {...a11yProps(0)} />
        <Tab label="Stable" {...a11yProps(1)} />
        <Tab label="Non-stable" {...a11yProps(2)} />
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
            value={selectValue}
            onChange={(e) => setSelectValue(Number(e.target.value))}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{ borderRadius: "16px", opacity: 0.6 }}
          >
            <MenuItem value={10}>Highest Balance</MenuItem>
            <MenuItem value={20}>Lowest Balance</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

const ListItem = () => {
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
        <Box component={"img"} src={"image-97.png"} />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: "1.125rem",
          }}
        >
          USDC
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: "1.125rem",
          }}
        >
          567.43
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
          $56.72
        </Typography>
      </Box>
    </Box>
  );
};

const WalletBalanceTable = ({ onClick }: WalletBalanceTableProps) => {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        p: "1.6rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      }}
    >
      <FilterAndTabPanel />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
    </Box>
  );
};

export default WalletBalanceTable;
