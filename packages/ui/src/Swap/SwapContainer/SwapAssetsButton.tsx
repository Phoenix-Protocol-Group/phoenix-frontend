import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import { colors, borderRadius, shadows } from "../../Theme/styleConstants";

interface SwapAssetsButtonProps {
  onClick: () => void;
}

export const SwapAssetsButton = ({ onClick }: SwapAssetsButtonProps) => {
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
        borderRadius: borderRadius.md,
        minWidth: 0,
        top: "25%",
        position: "absolute",
        background: colors.primary.gradient,
        transform: "translate(-50%, -50%)",
        left: "50%",
        boxShadow: shadows.card,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translate(-50%, -50%) scale(1.15)",
          background: colors.primary.gradient,
        },
      }}
    >
      <motion.img
        src="/ArrowsDownUp.svg"
        alt="Swap"
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: isSpinning ? Infinity : 0,
        }}
      />
    </Button>
  );
};
