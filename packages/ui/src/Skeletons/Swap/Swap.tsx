import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

export const Swap = () => {
  return (
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
      </Box>
      <Skeleton variant="rounded" height="86px" />
      <Skeleton variant="rounded" height="86px" sx={{ mt: 1 }} />
      <Skeleton variant="rounded" height="56px" sx={{ mt: 2 }} />
      <Box
        sx={{
          marginTop: "24px",
          borderRadius: "16px",
        }}
      >
        <Accordion
          disableGutters
          expanded={true}
          sx={{
            background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  maxWidth: "20px",
                }}
              />
            }
          >
            <Typography
              sx={{
                fontWeight: "700",
              }}
            >
              Swap details
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
                <Typography sx={listItemNameStyle}>Exchange rate</Typography>
                <Typography sx={listItemContentStyle}>
                  <Skeleton variant="text" width="100px" />
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>Network fee</Typography>
                <Typography sx={listItemContentStyle}>
                  {" "}
                  <Skeleton variant="text" width="100px" />
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>Route</Typography>
                <Typography sx={listItemContentStyle}>
                  {" "}
                  <Skeleton variant="text" width="100px" />
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Slippage tolerance
                </Typography>
                <Typography sx={listItemContentStyle}>
                  <Skeleton variant="text" width="100px" />
                </Typography>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};
