import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@phoenix-protocol/ui";

export const RestoreModal = ({ isOpen, onClose, onRestore }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await onRestore(); // Execute the transaction restoration
      // Wait at least 5 seconds minimum before closing
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onClose();
    } catch (error) {
      console.error("Error during restoration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(512px, 90%)",
    maxWidth: "100vw",
    background: "#1F1F1F",
    borderRadius: "16px",
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.6)",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "24px",
    overflow: "hidden",
  };

  return (
    <MuiModal
      open={isOpen}
      onClose={isLoading ? undefined : onClose} // Disable close action if loading
      aria-labelledby="restore-modal"
      aria-describedby="Transaction Restore Needed"
    >
      <Box sx={style}>
        {/* Close Button */}
        {!isLoading && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#FFF",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#FFF",
              fontWeight: 700,
              fontSize: "1.5rem",
              mb: 1,
              fontFamily: "Ubuntu",
            }}
          >
            Transaction Restore Needed
          </Typography>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid #444",
            p: "1.5rem",
            width: "100%",
            background: "#2A2A2A",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontFamily: "Poppins",
              color: "#FFF",
              mb: 2,
            }}
          >
            You need to restore some contract state before you can invoke this
            method. Do you want to proceed with restoration?
          </Typography>

          {/* Loading Indicator */}
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                mt: 3,
              }}
            >
              <CircularProgress sx={{ color: "#FFF" }} />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "Poppins",
                  color: "#FFF",
                  mt: 2,
                }}
              >
                Restoring transaction, please wait...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                onClick={handleRestore}
                sx={{
                  color: "#FFF",
                  backgroundColor: "#3f51b5",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                  mr: 2,
                }}
              >
                Restore
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </MuiModal>
  );
};
