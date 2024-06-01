// components/SwapAnimation.tsx
import { Box } from "@mui/material";
import { Token } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import React from "react";

const animationVariants = {
  animate: {
    x: [-45, 0, 45, 0, -45],
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.2, 1],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        ease: "easeInOut",
      },
      opacity: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
      scale: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  },
};
const SwapAnimation: React.FC = ({
  fromToken,
  toToken,
}: {
  fromToken: Token;
  toToken: Token;
}) => {
  const phoIconStyle = {
    position: "relative",
    top: "-4px",
  };

  return (
    <Box
      sx={{ width: "130%" }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
    >
      <Box
        component="img"
        src={fromToken.icon}
        sx={fromToken.name === "PHO" ? { phoIconStyle } : {}}
      />
      <Box display="flex" gap={1}>
        <motion.div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
            boxShadow: `0 0 0 1px #E2491A, 0 0 0 1px #E21B1B, 0 0 0 1px #E2491A, 0 0 0 1px #E2AA1B`, // Simulating border with shadow
          }}
          variants={animationVariants}
          animate="animate"
        />
      </Box>
      <Box
        component="img"
        src={toToken.icon}
        sx={
          toToken.name === "PHO"
            ? { phoIconStyle }
            : { width: "32px", height: "32px" }
        }
      />
    </Box>
  );
};

export default SwapAnimation;
