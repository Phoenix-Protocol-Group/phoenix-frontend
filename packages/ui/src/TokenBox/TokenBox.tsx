import { Box, Button, Grid, Input, Typography } from "@mui/material";
import React from "react";

interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

interface TokenBoxProps {
  token: Token;
  onAssetClick?: () => void;
  onChange: (value: string) => void;
  hideDropdownButton?: boolean;
}

const AssetButton = ({
  token,
  onClick,
  hideDropdownButton = false,
}: {
  token: Token;
  onClick?: () => void;
  hideDropdownButton?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        fontSize: "14px",
        padding: "4px",
        borderRadius: "8px",
        background: hideDropdownButton
          ? "none"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        display: "inline-flex",
        color: "white",
        "&:hover": {
          background: hideDropdownButton ? "none" : "rgba(226, 87, 28, 0.08)",
        },
        cursor: hideDropdownButton ? "auto" : "pointer",
        pointerEvents: hideDropdownButton ? "none" : "auto",
      }}
    >
      <Box
        component={"img"}
        src={token.icon}
        sx={{
          maxWidth: "24px",
          marginRight: "8px",
        }}
      />
      {token.name}
      <Box
        component={"img"}
        src="/CaretDown.svg"
        sx={{
          display: hideDropdownButton ? "none" : "block",
        }}
      />
    </Button>
  );
};

const TokenBox = ({
  token,
  onAssetClick,
  onChange,
  hideDropdownButton = false,
}: TokenBoxProps) => {
  const [inputValue, setInputValue] = React.useState("0.00");
  const [usdPrice, setUsdPrice] = React.useState(0);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
        padding: "10px 16px",
        borderRadius: "16px",
        border: "1px solid #E2621B",
      }}
    >
      <Grid container>
        <Grid item xs={6}>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setUsdPrice(Number(e.target.value) * Number(token.usdValue));
              onChange(e.target.value);
            }}
            sx={{
              color: "#FFF",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "140%",
              "&:before": {
                content: "none",
              },
              "&:after": {
                content: "none",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <AssetButton
            hideDropdownButton={hideDropdownButton}
            token={token}
            onClick={onAssetClick}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            fontSize: "14px",
            color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));",
          }}
        >
          ${usdPrice.toFixed(2)}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: "140%",
              color:
                "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));",
            }}
          >
            Balance {token.amount}
          </Typography>
          <Button
            onClick={() => {
              setInputValue(token.amount.toString());
              onChange(token.amount.toString());
            }}
            sx={{
              color: "white",
              fontSize: "12px",
              lineHeight: "140%",
              minWidth: "unset",
              padding: 0,
              marginLeft: 1,
              "&:hover": {
                background: "transparent",
              },
            }}
          >
            Max
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export { TokenBox };
