import React from "react";
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import Colors from "../../Theme/colors";
import { SlippageOptionsProps } from "@phoenix-protocol/types";

const SlippageSettings = ({
  options,
  selectedOption,
  onClose,
  onChange,
}: SlippageOptionsProps) => {
  const [customInputValue, setCustomInputValue] = React.useState("");

  const handleChange = (optionValue: string) => {
    onChange(optionValue !== "custom" ? optionValue : customInputValue);
  };

  const handleCustomInputChange = (event) => {
    const value = Number(event.target.value) > 30 ? "30" : event.target.value;

    setCustomInputValue(value);
    handleChange(value);
  };

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
          Settings
        </Typography>
      </Box>
      <Alert sx={{ mt: 2 }} severity="info">
        In the ongoing Phase 1 of the launch, there's a maximum allowed slippage
        of 1%. This will be increased as we progress through the launch phases.
      </Alert>
      <Box
        sx={{
          borderRadius: "16px",
          background:
            "linear-gradient(180deg, #292B2C 0%, #222426 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          padding: "16px",
          marginBottom: "16px",
          marginTop: "16px",
        }}
      >
        <FormControl>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "400",
              lineHeight: "18px",
              color:
                "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
            }}
          >
            Select Spread tolerance
          </Typography>
          <RadioGroup
            defaultValue={selectedOption}
            onChange={(e: any) => handleChange(e.target.value)}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.charAt(0)}
                disabled={index !== 0}
                control={
                  <Radio
                    color="primary"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "14px",
                      lineHeight: "140%",
                    }}
                  >
                    {option}
                  </Typography>
                }
              />
            ))}
            <FormControlLabel
              value="custom"
              disabled={true}
              control={
                <Radio
                  color="primary"
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                  }}
                />
              }
              label={
                <TextField
                  value={customInputValue}
                  onChange={handleCustomInputChange}
                  placeholder="Custom option"
                  disabled={true}
                  type="number"
                  inputProps={{ min: 0, max: 30 }}
                  InputLabelProps={{
                    sx: {
                      color: "white!important",
                      fontSize: "14px",
                      opacity: 0.6,
                      textAlign: "center",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    sx: {
                      minWidth: "140px",
                      color: "white",
                      fontSize: "14px",
                      lineHeight: "16px",
                      borderRadius: "16px",
                      "&:hover fieldset": {
                        border: "1px solid #E2621B!important",
                      },
                      "&:focus-within fieldset, &:focus-visible fieldset": {
                        border: "2px solid #E2621B!important",
                        color: "white!important",
                      },
                    },
                  }}
                />
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export { SlippageSettings };
