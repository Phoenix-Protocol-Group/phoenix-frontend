import React, { FC, useState } from "react";
import { Box, Typography, Button, IconButton, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Close,
  ErrorOutline,
  CopyAll,
  ExpandMore,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// Define Toast props type
interface ToastProps {
  type: "success" | "error" | "loading";
  message: string;
  transactionId?: string;
  onClose: () => void;
}

// Toast Component
export const Toast: FC<ToastProps> = ({
  type,
  message,
  transactionId,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          minWidth: 400,
          maxWidth: 400,
          background: "linear-gradient(135deg, #2c2c2c 30%, #333 100%)",
          color: "#fff",
          padding: 2.5,
          borderRadius: 3,
          display: "flex",
          alignItems: "flex-start",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            marginRight: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background:
              type === "success"
                ? "rgba(76, 175, 80, 0.15)"
                : type === "error"
                ? "rgba(244, 67, 54, 0.15)"
                : "rgba(255, 255, 255, 0.15)",
          }}
        >
          {type === "success" && (
            <CheckCircle sx={{ color: "#4caf50", fontSize: 30 }} />
          )}
          {type === "error" && (
            <ErrorOutline sx={{ color: "#f44336", fontSize: 30 }} />
          )}
          {type === "loading" && <CircularProgress size={28} color="inherit" />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              lineHeight: 1.3,
              marginBottom: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {type === "success" && "Transaction Successful!"}
            {type === "error" && "Error Occurred"}
            {type === "loading" && "Processing..."}
          </Typography>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {message}
            </Typography>
          </Collapse>
          {!expanded && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {message}
            </Typography>
          )}
          {type === "error" && message.length > 50 && (
            <Button
              variant="text"
              color="primary"
              onClick={handleExpandClick}
              sx={{
                textTransform: "none",
                padding: 0,
                marginTop: 1,
                color: "#90caf9",
                fontSize: "0.85rem",
              }}
              endIcon={<ExpandMore />}
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
          )}
          {transactionId && type === "success" && (
            <Button
              variant="text"
              color="primary"
              href={`https://blockexplorer.com/tx/${transactionId}`}
              target="_blank"
              sx={{
                textTransform: "none",
                padding: 0,
                marginTop: 1,
                color: "#90caf9",
                fontSize: "0.85rem",
              }}
            >
              View on Block Explorer
            </Button>
          )}
          {type === "error" && message.length > 50 && (
            <Box mt={1}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigator.clipboard.writeText(message)}
                sx={{
                  textTransform: "none",
                  padding: 0,
                  color: "#90caf9",
                  fontSize: "0.85rem",
                }}
                startIcon={<CopyAll />}
              >
                Copy Error Message
              </Button>
            </Box>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            marginLeft: 2,
            color: "#fff",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            padding: 0.5,
            alignSelf: "flex-start",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </motion.div>
  );
};
