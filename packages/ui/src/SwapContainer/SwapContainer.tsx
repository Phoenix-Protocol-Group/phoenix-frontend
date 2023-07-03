import { Box, Divider, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwapBox from "./SwapBox";
import {Button} from "@mui/material";

export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

interface SwapContainerProps {
  fromToken: Token;
  toToken: Token;
  onOptionsClick: () => void;
  onSwapTokensClick: () => void;
  onTokenSelectorClick: () => void;
}

const SwapAssetsButton = ({
  onClick
}: {
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={() => onClick()}
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
  onOptionsClick,
  onSwapTokensClick,
  onTokenSelectorClick
}: SwapContainerProps) => {
  return (
    <Box sx={{
      maxWidth: "600px"
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
      <SwapBox token={fromToken} onClick={onTokenSelectorClick}/>
      <Box sx={{
        height: "8px",
        width: "100%",
        position: "relative"
      }}>
        <SwapAssetsButton onClick={onSwapTokensClick}/>
      </Box>
      <SwapBox token={toToken} onClick={onTokenSelectorClick}/>
      <Box sx={{
        marginTop: "24px",
        borderRadius: "16px"
      }}>
        <Accordion 
          disableGutters 
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
          <AccordionDetails>
            <List>
              <ListItem>
                <Typography sx={{
                  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                  fontSize: "14px"
                }}>
                  Exchange rate
                </Typography>
              </ListItem>
              <ListItem>
                Network fee
              </ListItem>
              <ListItem>
                Route
              </ListItem>
              <ListItem>
                Est. BTC sell price
              </ListItem>
              <ListItem>
                Min. BTC sell price
              </ListItem>
              <ListItem>
                Slippage tolerance
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export { SwapContainer };
