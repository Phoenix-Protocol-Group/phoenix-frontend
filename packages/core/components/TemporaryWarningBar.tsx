import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

export default function TemporaryWarningBar() {
  const [showBar, setShowBar] = React.useState(true);

  if (!showBar) return null;

  return (
    <Box
      position="fixed"
      bottom={2}
      left={2}
      right={2}
      width="90%"
      marginX="auto"
      marginBottom={2}
      borderRadius={3}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="error.main"
      color="white"
      zIndex={9999}
      sx={{
        backgroundImage:
          "linear-gradient(rgb(41, 43, 44) 0%, rgb(31, 33, 35) 100%)",
      }}
      p={2}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <WarningIcon sx={{ mr: 1, color: "red" }} />
        <Box>
          <Typography variant="body2">
            We{"'"}re experiencing some technical difficulties with our indexer.
          </Typography>
          <Typography variant="body2">
            Please bear with us as we work to resolve them. Numbers and
            statistics shown may not be accurate. Thank you for your patience.
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={() => setShowBar(false)}
        aria-label="close"
        sx={{ color: "white" }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
