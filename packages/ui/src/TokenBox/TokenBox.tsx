import { Box, Button, Grid, Typography } from "@mui/material";

interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

interface TokenBoxProps {
  token: Token;
  onClick: () => void;
  hideDropdownButton?: boolean;
}

const AssetButton = ({
  token,
  onClick,
  hideDropdownButton
}: TokenBoxProps) => {
  return (
    <Button 
      onClick={() => onClick()}
      sx={{
        fontSize: "14px",
        padding: "4px",
        borderRadius: "8px",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        display: "inline-flex",
        color: "white"
      }}
    >
      <Box component={"img"} src={token.icon} sx={{
        maxWidth: "24px",
        marginRight: "8px"
      }} />
      {token.name}
      <Box component={"img"} src="/CaretDown.svg" sx={{
        display: hideDropdownButton ? "none" : "block"
      }} />
    </Button>
  );
};

const TokenBox = ({
  token,
  onClick,
  hideDropdownButton = false
}: TokenBoxProps) => {
  return (
    <Box sx={{
      background: "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
      padding: "10px 16px",
      borderRadius: "16px",
      border: "1px solid #E2621B"
    }}>
      <Grid container>
        <Grid item xs={6}>
          0.00
        </Grid>
        <Grid item xs={6} sx={{
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <AssetButton hideDropdownButton={hideDropdownButton} token={token} onClick={onClick}/>
        </Grid>
        <Grid item xs={6} sx={{
          fontSize: "14px",
          color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));"
        }}>
          $0.00
        </Grid>
        <Grid item xs={6} sx={{
          display: "flex",
          justifyContent: 'flex-end',
          alignItems: "flex-end"
        }}>
          <Typography sx={{
            fontSize: "12px",
            lineHeight: "140%",
            color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));"
          }}>
            Balance 2.68448332
          </Typography>
          <Button sx={{
            color: "white",
            fontSize: "12px",
            lineHeight: "140%",
            minWidth: "unset",
            padding: 0,
            marginLeft: 1,
            "&:hover": {
              background: "transparent"
            }
          }}>Max</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export {TokenBox};
