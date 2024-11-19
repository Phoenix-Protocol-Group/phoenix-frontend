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
        marginTop: "1rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        color: "#FFF",
        borderRadius: "16px",
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "none",
        "&:hover": {
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%)",
        },
      }}
      component={motion.div}
      whileHover={{ scale: 1.05 }}
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
    {
      title: "25%",
      value: 0.25,
    },
    {
      title: "50%",
      value: 0.5,
    },
    {
      title: "75%",
      value: 0.75,
    },
    {
      title: "100%",
      value: 1,
    },
  ];

  return (
    <>
      <TextField
        id="input"
        type="number"
        value={amount}
        placeholder="0.00"
        fullWidth
        sx={{
          color: "white",
          marginTop: "1rem",
          "&::placeholder": {
            color: "white",
            opacity: 0.6,
            fontSize: "0.8125rem!important",
          },
        }}
        onChange={(e) => setAmount(e.target.value)}
        InputLabelProps={{
          sx: {
            color: "white!important",
            fontSize: "0.8125rem",
            opacity: 0.6,
            textAlign: "center",
          },
        }}
        inputProps={{
          min: 0,
          max: balance,
        }}
        InputProps={{
          endAdornment: (
            <Box
              sx={{
                borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
                paddingLeft: "0.75rem",
              }}
            >
              <Typography
                sx={{ fontSize: "1rem", color: "#FFF", fontWeight: 700 }}
              >
                {tokenName}
              </Typography>
            </Box>
          ),
          sx: {
            color: "white",
            borderRadius: "16px",
            "&:hover fieldset": {
              border: "1px solid #E2621B!important",
            },
            "&:focus-within fieldset, &:focus-visible fieldset": {
              border: "1px solid #E2621B!important",
              color: "white!important",
            },
            "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
          },
        }}
      />
      <Grid container spacing={2}>
        {options.map((value, index) => (
          <Grid item key={index} xs={3}>
            <OptionButton
              onClick={(number) => setAmount((balance * number).toString())}
              {...value}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            disabled={Number(amount) > balance || Number(amount) <= 0}
            fullWidth
            //@ts-ignore
            variant="primary"
            //@ts-ignore
            size="large"
            onClick={onStake}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            Stake
          </Button>
          <Typography sx={{ fontSize: "0.875rem", opacity: 0.7, mt: 1 }}>
            Available {balance.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </>
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
    <Box
      sx={{
        borderRadius: "0.5rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        backdropFilter: "blur(42px)",
        position: "relative",
        padding: "1rem",
        height: !largerThenMd ? "calc(100% + 44px)" : "100%",
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        <Typography sx={{ opacity: 0.7, fontSize: "0.875rem" }}>
          Total rewards
        </Typography>
        {rewards.length > 0 ? (
          rewards.map((reward, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Box
                component="img"
                src={reward.icon}
                sx={{ width: "1.125rem", height: "1.125rem" }}
              />
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
                {reward.amount} {reward.name}
              </Typography>
            </Box>
          ))
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
              No rewards
            </Typography>
          </Box>
        )}
      </Box>
      <Button
        // @ts-ignore
        variant="primary"
        // @ts-ignore
        size="large"
        sx={{
          position: "absolute",
          bottom: "1rem",
          width: "calc(100% - 2rem)",
          background: rewards.length > 0 ? "#E2621B" : "#6F6F6F",
        }}
        onClick={onClaim}
        disabled={rewards.length === 0}
        component={motion.div}
        whileHover={{ scale: rewards.length > 0 ? 1.05 : 1 }}
      >
        Claim
      </Button>
    </Box>
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontSize: "1.125rem",
            fontWeight: 700,
            marginBottom: 0,
          }}
        >
          Liquidity Mining
        </Typography>
        <Typography sx={{ mt: "0.75rem", opacity: 0.7, fontSize: "0.875rem" }}>
          Bond liquidity to earn liquidity reward and swap fees
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
  );
};

export default LiquidityMining;
