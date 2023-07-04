import { Box, Divider, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TokenBox } from "../TokenBox/TokenBox";
import {Button} from "@mui/material";
import { useState } from "react";

interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

interface SwapContainerProps {
  fromToken: Token;
  toToken: Token;
  exchangeRate: string;
  networkFee: string;
  route: string;
  estSellPrice: string;
  minSellPrice: string;
  slippageTolerance: string;
  onOptionsClick: () => void;
  onSwapTokensClick: () => void;
  onTokenSelectorClick: (isFromToken: boolean) => void;
}

const listItemContainer = {
  display: "flex",
  justifyContent: "space-between"
};

const listItemNameStyle = {
  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
  fontSize: "14px",
  lineHeight: "140%",
  marginBottom: 0
};

const listItemContentStyle = {
  color: "#FFF",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "140%",
};

const SwapAssetsButton = ({
  onClick
}: {
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        padding: "4px",
        borderRadius: "8px",
        minWidth: 0,
        top: "4px",
        position: "absolute",
        background: "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%), #E2491A",
        transform: "translate(-50%, -50%)",
        left: "50%"
      }}
    >
      <img src="/ArrowsDownUp.svg"/>
    </Button>
  );
};

const SwapContainer = ({
  fromToken,
  toToken,
  exchangeRate,
  networkFee,
  route,
  estSellPrice,
  minSellPrice,
  slippageTolerance,
  onOptionsClick,
  onSwapTokensClick,
  onTokenSelectorClick
}: SwapContainerProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{
      maxWidth: "600px",
      width: "100%"
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px"
      }}>
        <Typography sx={{
          fontSize: "32px",
          fontWeight: "700"
        }}>
          Swap tokens instantly
        </Typography>
        <Box>
          <IconButton 
            onClick={onOptionsClick}
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
              marginTop: "8px"
            }}
          >
            <Box component={"img"} src="/Gearsix.svg"/>
          </IconButton>
        </Box>
      </Box>
      <TokenBox token={fromToken} onClick={() => onTokenSelectorClick(true)}/>
      <Box sx={{
        height: "8px",
        width: "100%",
        position: "relative"
      }}>
        <SwapAssetsButton onClick={onSwapTokensClick}/>
      </Box>
      <TokenBox token={toToken} onClick={() => onTokenSelectorClick(false)}/>
      <Box sx={{
        marginTop: "24px",
        borderRadius: "16px"
      }}>
        <Accordion 
          onChange={(e, isExpanded) => setExpanded(isExpanded)}
          disableGutters 
          expanded={expanded}
          sx={{
            background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
          }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{
              maxWidth: "20px"
            }} />}
          >
            <Typography sx={{
              fontWeight: "700"
            }}>Swap details</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.10)",
            margin: 0,
            padding: 0,
            paddingBottom: "8px"
          }}>
            <List sx={{
              padding: 0,
              margin: 0
            }}>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Exchange rate
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {exchangeRate}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Network fee
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {networkFee}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Route
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {route}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Est. BTC sell price
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {estSellPrice}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Min. BTC sell price
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {minSellPrice}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Slippage tolerance
                </Typography>
                <Typography sx={listItemContentStyle}>
                 {slippageTolerance}
                </Typography>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export { SwapContainer };
