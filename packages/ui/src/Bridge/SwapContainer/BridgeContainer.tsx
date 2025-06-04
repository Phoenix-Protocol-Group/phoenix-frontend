import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { BridgeTokenBox } from "../TokenBox/BridgeTokenBox";
import { Button } from "../../Button/Button";
import { BridgeContainerProps } from "@phoenix-protocol/types";

const listItemContainer = {
  display: "flex",
  justifyContent: "space-between",
};

const listItemNameStyle = {
  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
  fontSize: "14px",
  lineHeight: "140%",
  marginBottom: 0,
};

const listItemContentStyle = {
  color: "#FFF",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "140%",
};

const SwapAssetsButton = ({ onClick }: { onClick: () => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (!isSpinning) {
      onClick();
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 1000); // Reset spinning animation after 1 second
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="swap-assets-button"
      sx={{
        padding: "4px",
        borderRadius: "8px",
        minWidth: 0,
        top: "4px",
        position: "absolute",
        background:
          "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%), #E2491A",
        transform: "translate(-50%, -50%)",
        left: "50%",
        transition: "transform 0.3s ease-in-out", // Add smooth transition for transform
        "&:hover": {
          transform: "translate(-50%, -50%) scale(1.1)", // Scale up on hover
        },
      }}
    >
      <motion.img
        src="/ArrowsDownUp.svg"
        alt="Swap"
        animate={{ rotate: isSpinning ? 360 : 0 }} // Spin animation
        transition={{
          duration: 1,
          ease: "linear",
          repeat: isSpinning ? Infinity : 0,
        }}
      />
    </Button>
  );
};

const BridgeContainer = ({
  fromToken,
  toToken,
  exchangeRate,
  networkFee,
  fromChain,
  toChain,
  fromTokenValue,
  toTokenValue,
  onOptionsClick,
  onSwapTokensClick,
  onSwapButtonClick,
  onTrustlineButtonClick,
  onInputChange,
  swapButtonDisabled,
  onTokenSelectorClick,
  loadingSimulate = false,
  trustlineButtonActive = false,
  trustlineButtonDisabled = false,
  trustlineAssetName,
}: BridgeContainerProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Swap tokens instantly
          </Typography>
          <IconButton
            onClick={onOptionsClick}
            className="slippage-button"
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
              marginTop: "8px",
            }}
          >
            <img src="/GearSix.svg" alt="Options" />
          </IconButton>
        </Box>
        <div className="token-box">
          <BridgeTokenBox
            value={fromTokenValue}
            token={fromToken}
            chain={fromChain}
            onAssetClick={() => onTokenSelectorClick(true)}
            onChange={(value) => onInputChange(true, value)}
          />
          <Box
            sx={{
              height: "8px", // Set fixed height for the square container
              width: "36px", // Set fixed width for the square container
              position: "relative",
              margin: "0 auto", // Center the box horizontally
            }}
          >
            <SwapAssetsButton onClick={onSwapTokensClick} />
          </Box>

          <BridgeTokenBox
            value={toTokenValue}
            token={toToken}
            onAssetClick={() => onTokenSelectorClick(false)}
            onChange={(value) => onInputChange(false, value)}
            disabled={true}
            chain={toChain}
            loadingValues={loadingSimulate}
          />
        </div>
        {trustlineButtonActive ? (
          <>
            <Button
              onClick={onTrustlineButtonClick}
              disabled={trustlineButtonDisabled}
              type="primary"
              label={
                trustlineButtonDisabled
                  ? `You need more than 0.5 XLM on your wallet`
                  : `Add ${trustlineAssetName} trustline`
              }
              sx={{
                marginTop: "16px",
                width: "100%",
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              To hold other tokens than XLM, you need to add a trustline first.
              Trustlines are permissions to hold tokens on the Stellar network.
              Setting the trustline reserves 0.5 XLM from your account.
            </Alert>
          </>
        ) : (
          <Button
            onClick={onSwapButtonClick}
            disabled={swapButtonDisabled}
            type="primary"
            label="Swap"
            sx={{
              marginTop: "16px",
              width: "100%",
            }}
          />
        )}
        <Box
          sx={{
            marginTop: "24px",
            borderRadius: "16px",
          }}
        >
          <Accordion
            onChange={(e, isExpanded) => setExpanded(isExpanded)}
            disableGutters
            expanded={expanded}
            sx={{
              background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ maxWidth: "20px" }} />}
            >
              <Typography
                sx={{
                  fontWeight: "700",
                }}
              >
                Bridge details
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                borderTop: "1px solid rgba(255, 255, 255, 0.10)",
                margin: 0,
                padding: 0,
                paddingBottom: "8px",
              }}
            >
              <List
                sx={{
                  padding: 0,
                  margin: 0,
                }}
              >
                <ListItem sx={listItemContainer}>
                  <Typography sx={listItemNameStyle}>Fees</Typography>
                  <Typography sx={listItemContentStyle}>
                    {exchangeRate}
                  </Typography>
                </ListItem>
                <ListItem sx={listItemContainer}>
                  <Typography sx={listItemNameStyle}>
                    Average Transfer Time
                  </Typography>
                  <Typography sx={listItemContentStyle}>
                    {networkFee}
                  </Typography>
                </ListItem>
                <ListItem sx={listItemContainer}>
                  <Typography sx={listItemNameStyle}>
                    Bridge Provider
                  </Typography>
                  <Typography
                    sx={{
                      ...listItemContentStyle,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{ mr: 1 }}
                      src="/chainIcons/allbridge.png"
                    />{" "}
                    Allbridge
                  </Typography>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </motion.div>
  );
};

export { BridgeContainer };
