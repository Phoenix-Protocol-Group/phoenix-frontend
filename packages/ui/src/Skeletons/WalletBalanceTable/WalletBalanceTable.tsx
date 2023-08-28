import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function a11yProps(index: number) {
  return {
    id: `category-tab-${index}`,
    "aria-controls": `category-tabpanel-${index}`,
  };
}

const FilterAndTabPanel = ({
  isMobile,
}: {
  isMobile: boolean;
}) => {

  if (!isMobile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Grid container p={0} spacing={1}>
        <Grid item xs={12}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
        </Grid>
      </Grid>
    );
  }
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
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', minWidth: "160px"}} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', marginRight: "16px", minWidth: "70px" }} />
        <Skeleton variant="rounded" width={24} height={24} />
      </Box>
    </Box>
  );
};

const WalletBalanceTable = () => {
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
      }}
    >
      <FilterAndTabPanel
        isMobile={!largerThenMd}
      />
      <Box sx={{ overflow: "auto", maxHeight: "19rem" }}>
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
      </Box>
    </Box>
  );
};

export default WalletBalanceTable;
