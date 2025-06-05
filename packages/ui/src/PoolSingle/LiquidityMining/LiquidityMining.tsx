/**
 * OptionButton Component
 * A button that displays a percentage option for staking.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {number} props.value - The percentage value to set the stake amount.
 * @param {string} props.title - The button label.
 * @param {function} props.onClick - The function to handle button click.
 */
import React, { useState } from "react";
import {
  Box,
  Button as MuiButton,
  Grid,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Button } from "../../Button/Button";
import { Token, LiquidityMiningProps } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import { colors, spacing } from "../../Theme/styleConstants";

const OptionButton = ({
  value,
  title,
  onClick,
}: {
  value: number;
  title: string;
  onClick: (number: number) => void;
}) => {
  return (
    <MuiButton
      variant="contained"
      onClick={() => onClick(value)}
      sx={{
        width: "100%",
        background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
        color: colors.neutral[300],
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: 600,
        textTransform: "none",
        border: `1px solid ${colors.neutral[700]}`,
        fontFamily: "Ubuntu, sans-serif",
        py: 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          background: "rgba(249, 115, 22, 0.1)",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          color: "#F97316",
          boxShadow: "0 4px 16px rgba(249, 115, 22, 0.2)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      {title}
    </MuiButton>
  );
};

/**
 * StakeInput Component
 * Handles user input for staking tokens.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {function} props.onStake - Function to handle staking.
 * @param {number} props.balance - The user's token balance.
 * @param {string} props.amount - The current stake amount.
 * @param {function} props.setAmount - Function to set the stake amount.
 * @param {string} props.tokenName - The name of the token.
 */
const StakeInput = ({
  onStake,
  balance,
  amount,
  setAmount,
  tokenName,
}: {
  onStake: () => void;
  balance: number;
  amount: string;
  setAmount: (amount: string) => void;
  tokenName: string;
}) => {
  const options = [
    { title: "25%", value: 0.25 },
    { title: "50%", value: 0.5 },
    { title: "75%", value: 0.75 },
    { title: "MAX", value: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TextField
        id="input"
        type="number"
        value={amount}
        placeholder="0.00"
        fullWidth
        sx={{
          marginTop: spacing.md,
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            background: "rgba(249, 115, 22, 0.08)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            backdropFilter: "blur(10px)",
            fontFamily: "Inter, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 500,
            "&:hover": {
              border: "1px solid rgba(249, 115, 22, 0.4)",
            },
            "&.Mui-focused": {
              border: "1px solid rgba(249, 115, 22, 0.6)",
              boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.1)",
            },
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
          "& .MuiInputBase-input": {
            color: "#FFFFFF",
            padding: "16px 20px",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          },
        }}
        onChange={(e) => setAmount(e.target.value)}
        inputProps={{
          min: 0,
          max: balance,
        }}
        InputProps={{
          endAdornment: (
            <Box
              sx={{
                borderLeft: "1px solid rgba(249, 115, 22, 0.3)",
                paddingLeft: "1rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                LP
              </Box>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontFamily: "Ubuntu, sans-serif",
                }}
              >
                {tokenName}
              </Typography>
            </Box>
          ),
        }}
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {options.map((option, index) => (
          <Grid item key={index} xs={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <OptionButton
                onClick={(number) => setAmount((balance * number).toString())}
                {...option}
              />
            </motion.div>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 2 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              disabled={Number(amount) > balance || Number(amount) <= 0}
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "16px",
                py: 1.5,
                px: 4,
                fontFamily: "Ubuntu, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#FFFFFF",
                textTransform: "none",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  boxShadow: "0 12px 40px rgba(249, 115, 22, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "none",
                },
              }}
              onClick={onStake}
            >
              Stake Tokens
            </Button>
          </motion.div>

          <Typography
            sx={{
              fontSize: "0.875rem",
              mt: 1.5,
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
            }}
          >
            Available: {balance.toFixed(4)} {tokenName}
          </Typography>
        </Grid>
      </Grid>
    </motion.div>
  );
};

/**
 * ClaimRewards Component
 * Displays the rewards the user can claim and provides a button to claim them.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Token[]} props.rewards - The list of rewards available.
 * @param {function} props.onClaim - Function to handle claiming rewards.
 */
const ClaimRewards = ({
  rewards,
  onClaim,
}: {
  rewards: Token[];
  onClaim: () => void;
}) => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(251, 146, 60, 0.08) 100%)",
          border: "1px solid rgba(249, 115, 22, 0.2)",
          backdropFilter: "blur(15px)",
          position: "relative",
          p: 3,
          height: !largerThenMd ? "calc(100% + 44px)" : "100%",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent)",
          },
        }}
      >
        {/* Glow effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background:
              "radial-gradient(ellipse at center top, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "rgba(249, 115, 22, 0.8)",
              fontFamily: "Ubuntu, sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 2,
            }}
          >
            Total Rewards
          </Typography>

          {rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: index > 0 ? 1.5 : 0,
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(249, 115, 22, 0.08)",
                    border: "1px solid rgba(249, 115, 22, 0.15)",
                  }}
                >
                  <Box
                    component="img"
                    src={reward.icon}
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      border: "1px solid rgba(249, 115, 22, 0.2)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {reward.amount} {reward.name}
                  </Typography>
                </Box>
              </motion.div>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                p: 3,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "Inter, sans-serif",
                  textAlign: "center",
                }}
              >
                No rewards available
              </Typography>
            </Box>
          )}
        </Box>

        <motion.div style={{ height: "100px" }}>
          <Button
            // @ts-ignore
            variant="primary"
            // @ts-ignore
            size="large"
            sx={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              right: "1rem",
              mt: "5rem",
              width: "calc(100% - 2rem)",
              background:
                rewards.length > 0
                  ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                  : "rgba(255, 255, 255, 0.1)",
              border:
                rewards.length > 0
                  ? "1px solid rgba(249, 115, 22, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              color:
                rewards.length > 0 ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
              fontFamily: "Ubuntu, sans-serif",
              fontWeight: 600,
              borderRadius: "16px",
              py: 1.5,
              boxShadow:
                rewards.length > 0
                  ? "0 8px 32px rgba(249, 115, 22, 0.3)"
                  : "none",
              "&:hover": {
                background:
                  rewards.length > 0
                    ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  rewards.length > 0
                    ? "0 12px 40px rgba(249, 115, 22, 0.4)"
                    : "none",
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
            onClick={onClaim}
            disabled={rewards.length === 0}
          >
            Claim Rewards
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
};

/**
 * LiquidityMining Component
 * Main component for liquidity mining, allowing users to stake tokens and claim rewards.
 *
 * @component
 * @param {LiquidityMiningProps} props - Component properties.
 * @param {Token[]} props.rewards - The list of rewards available.
 * @param {function} props.onClaimRewards - Function to handle claiming rewards.
 * @param {number} props.balance - The user's token balance.
 * @param {string} props.tokenName - The name of the token.
 * @param {function} props.onStake - Function to handle staking tokens.
 */
const LiquidityMining = ({
  rewards,
  onClaimRewards,
  balance,
  tokenName,
  onStake,
}: LiquidityMiningProps) => {
  const [amount, setAmount] = useState<string>("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "24px",
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          p: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(${colors.neutral[600].slice(
              1
            )}, 0.4), transparent)`,
          },
        }}
      >
        {/* Animated background glow */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            ".MuiBox-root:hover &": {
              opacity: 1,
            },
            pointerEvents: "none",
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 1,
                background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Ubuntu, sans-serif",
                position: "relative",
                zIndex: 1,
              }}
            >
              Liquidity Mining
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              Bond liquidity to earn liquidity rewards and swap fees
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className="stake">
            <StakeInput
              balance={balance}
              setAmount={setAmount}
              amount={amount}
              onStake={() => onStake(Number(amount))}
              tokenName={tokenName}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <ClaimRewards onClaim={onClaimRewards} rewards={rewards} />
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default LiquidityMining;
