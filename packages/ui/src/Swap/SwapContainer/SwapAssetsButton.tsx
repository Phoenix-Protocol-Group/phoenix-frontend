import React, { useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../../Theme/styleConstants";

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
    <motion.div
      onClick={handleClick}
      className="swap-assets-button"
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: colors.primary.gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
        boxShadow: `0 2px 8px rgba(249, 115, 22, 0.3)`,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 4px 12px rgba(249, 115, 22, 0.4)`,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.img
        src="/ArrowsDownUp.svg"
        alt="Swap"
        width={16}
        height={16}
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: isSpinning ? Infinity : 0,
        }}
        style={{
          filter: "brightness(0) invert(1)", // Make the icon white
        }}
      />
    </motion.div>
  );
};
