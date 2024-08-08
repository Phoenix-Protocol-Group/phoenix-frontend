import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { BridgeAssetSelectorProps, Chain } from "@phoenix-protocol/types";
import AssetItem from "./AssetItem";

const containerStyle = {
  borderRadius: "16px",
  background:
    "linear-gradient(180deg, #292B2C 0%, #222426 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  padding: "16px",
  marginBottom: "16px",
  display: "flex",
};

const headerStyle = {
  fontSize: "13px",
  lineHeight: "18px",
  marginBottom: "18px",
};

const scrollbarStyles = {
  /* Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "#E2491A #1B1B1B",

  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    width: "4px",
  },

  "&::-webkit-scrollbar-track": {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E2491A",
    borderRadius: "8px",
  },
};

const AssetSelector = ({
  chains,
  onClose,
  onTokenClick,
}: BridgeAssetSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedChain, setSelectedChain] = useState<Chain>(chains[0]); // Default selected chain

  const getFilteredTokens = () => {
    return selectedChain.tokens.filter((token) =>
      token.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
          display: "flex", // Added flex display
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              marginBottom: "16px",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                maxWidth: "32px",
                maxHeight: "32px",
                margin: "8px 16px 0 0",
                borderRadius: "8px",
                background:
                  "linear-gradient(180deg, #292B2C 0%, #222426 100%),linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Typography
              sx={{
                color: "white",
                fontSize: "32px",
                fontWeight: "700",
              }}
            >
              Select Token
            </Typography>
          </Box>
          <Box sx={containerStyle}>
            {/* Chain Selection Column */}
            <Box sx={{ width: "200px", marginRight: "16px" }}>
              <Typography sx={headerStyle}>Select Chain</Typography>
              <List>
                {chains.map((chain, index) => (
                  <ListItem
                    sx={{
                      padding: "8px",
                      color: "white",
                      fontSize: "14px",
                      lineHeight: "140%",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-start",
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
                      "&:not(:last-of-type)": {
                        marginBottom: "8px",
                      },
                    }}
                    key={index}
                    selected={chain === selectedChain}
                    onClick={() => setSelectedChain(chain)}
                  >
                    <Box
                      component={"img"}
                      src={chain.icon}
                      sx={{
                        maxWidth: "24px",
                        marginRight: "8px",
                      }}
                    />
                    <ListItemText primary={chain.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={headerStyle}>
                All tokens on {selectedChain.name}
              </Typography>
              <Box
                sx={{
                  maxHeight: "30vh",
                  overflow: "auto",
                  ...scrollbarStyles,
                  paddingRight: "8px",
                }}
              >
                {getFilteredTokens().map((token, index) => (
                  <AssetItem key={index} token={token} onClick={onTokenClick} />
                ))}
                <Box
                  sx={{
                    display: getFilteredTokens().length ? "none" : "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="/search-not-found.svg"
                    alt="No assets found"
                    sx={{
                      maxWidth: "160px",
                    }}
                  />
                  <Typography
                    sx={{
                      lineHeight: "18px",
                      fontSize: "14px",
                      fontWeight: "400",
                      color:
                        "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                    }}
                  >
                    We didn’t find any assets for {searchValue}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export { AssetSelector };
