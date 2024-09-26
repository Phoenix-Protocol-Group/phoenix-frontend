import { Box, Button, Grid, Input, Skeleton, Typography } from "@mui/material";
import React from "react";
import { Chain, Token, TokenBoxProps } from "@phoenix-protocol/types";

const AssetButton = ({
  token,
  onClick,
  hideDropdownButton = false,
  chain,
}: {
  token: Token;
  onClick?: () => void;
  hideDropdownButton?: boolean;
  chain?: Chain;
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
        justifyContent: "space-between",
        color: "white",
        "&:hover": {
          background: hideDropdownButton ? "none" : "rgba(226, 87, 28, 0.08)",
        },
        cursor: hideDropdownButton ? "auto" : "pointer",
        pointerEvents: hideDropdownButton ? "none" : "auto",
        minWidth: "96px",
      }}
    >
      <Box>
        <Box display="flex">
          <Box
            component={"img"}
            src={token.icon}
            sx={{
              maxWidth: "24px",
              marginRight: "8px",
            }}
          />
          {token.name}
        </Box>
        {chain && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ textTransform: "none", fontSize: 12 }}>
              on
            </Typography>
            <Box
              component={"img"}
              sx={{ width: 16, height: 16 }}
              src={chain.icon}
            />{" "}
            <Typography sx={{ textTransform: "none", fontSize: 12 }}>
              {chain.name}
            </Typography>
          </Box>
        )}
      </Box>
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

const BridgeTokenBox = ({
  token,
  onAssetClick,
  onChange,
  value,
  hideDropdownButton = false,
  disabled = false,
  chain,
  loadingValues = false,
}: TokenBoxProps) => {
  const [usdPrice, setUsdPrice] = React.useState(
    Number(value) * Number(token.usdValue) || 0
  );

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
          {loadingValues ? (
            <Skeleton variant="text" width="80" animation="wave" />
          ) : (
            <Input
              disabled={disabled}
              value={value}
              onChange={(e) => {
                if (e.target.value.split(".")[1]?.length > 7) return;

                onChange(e.target.value);
                setUsdPrice(Number(e.target.value) * Number(token.usdValue));
              }}
              inputProps={{ min: 0, max: token.amount }}
              type="number"
              placeholder="0.00"
              sx={{
                color: "#FFF",
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "140%",
                width: "100%",
                "&:before": {
                  content: "none",
                },
                "&:after": {
                  content: "none",
                },
                "&:hover fieldset": {
                  border: "1px solid #E2621B!important",
                },
                "&:focus-within fieldset, &:focus-visible fieldset": {
                  border: "1px solid #E2621B!important",
                  color: "white!important",
                },
                "& input[type=number]": {
                  "-moz-appearance": "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              }}
            />
          )}
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
            chain={chain}
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
          {loadingValues ? (
            <Skeleton variant="text" width="80" animation="wave" />
          ) : (
            usdPrice.toFixed(2)
          )}
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
              onChange(token.amount.toString());
              setUsdPrice(token.amount * Number(token.usdValue));
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

export { BridgeTokenBox };
