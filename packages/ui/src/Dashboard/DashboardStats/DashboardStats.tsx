import { Box, Grid, Typography } from "@mui/material";

const stellarGainerAsset: GainerOrLooserAsset = {
  name: "Stellar",
  symbol: "XLM",
  price: "$3.00",
  change: 22.5,
  icon: "/cryptoIcons/xlm.svg",
  volume: "$100,000",
};

const usdcLoserAsset: GainerOrLooserAsset = {
  name: "USDC",
  symbol: "USDC",
  price: "$1",
  change: -0.8,
  icon: "/cryptoIcons/usdc.svg",
  volume: "$100,000",
};

interface GainerOrLooserAsset {
  name: string;
  symbol: string;
  price: string;
  change: number;
  icon: string;
  volume: string;
}

const AssetStat = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: string;
  value: string;
}) => (
  <Box
    sx={{
      borderRadius: "0.75rem",
      border: "1px solid rgba(255, 255, 255, 0.10)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        padding: "1.5rem 2rem",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          borderRadius: "0.5rem",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box component="img" alt="Hand Icon" src={icon} />
      </Box>
      <Box sx={{ marginLeft: "1.5rem" }}>
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.50);",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Box>
);

const GainerAndLooser = ({
  title,
  asset: { name, symbol, price, change, icon, volume },
}: {
  title: string;
  asset: GainerOrLooserAsset;
}) => (
  <Box>
    <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, opacity: 0.8 }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: "1rem",
        gap: 1,
      }}
    >
      <Box component="img" alt="Asset Icon" src={icon} />
      <Typography
        sx={{
          leadingTrim: "both",
          textEdge: "cap",
          fontSize: "0.875rem",
          fontWeight: 700,
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          leadingTrim: "both",
          textEdge: "cap",
          fontSize: "0.75rem",
          fontWeight: 400,
        }}
      >
        {symbol}
      </Typography>
    </Box>
    <Typography
      sx={{
        marginTop: "0.75rem",
        fontSize: "1.5rem",
        fontWeight: 700,
        letterSpacing: "-0.0625rem",
      }}
    >
      {price}
    </Typography>
    <Box sx={{ display: "flex", gap: 4, marginTop: "1.5rem" }}>
      <Box>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.5 }}>
          Change (24h)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, marginTop: "0.5rem" }}>
          <Box
            component="img"
            alt="Green arrow up"
            src={change > 0 ? "/green-arrow.svg" : "/red-arrow.svg"}
            sx={{ transform: `rotate(${change > 0 ? 0 : 180}deg)` }}
          />
          <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
            {change}%
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.5 }}>
          Volume (24h)
        </Typography>
        <Box sx={{ marginTop: "0.5rem" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
            {volume}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

const DashBoardStats = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        borderRadius: "1rem",
        padding: "2rem",
        height: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AssetStat
            title="Available assets"
            icon="/hand-coins.svg"
            value="$1,223.00"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AssetStat
            title="Locked assets"
            icon="/coins.svg"
            value="$1,223.00"
          />
        </Grid>
      </Grid>
      <Grid container sx={{ px: "1.6rem", mt: 3 }}>
        <Grid item xs={12} md={6} sx={{ padding: "1.2rem" }}>
          <GainerAndLooser title="Top Gainer" asset={stellarGainerAsset} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: "1.2rem 2.8rem",
            borderLeft: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <GainerAndLooser title="Top Loser" asset={usdcLoserAsset} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoardStats;
