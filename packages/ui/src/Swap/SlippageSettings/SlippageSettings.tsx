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
            color: "var(--neutral-300, #D4D4D4)", // Adjusted color
            background: "var(--neutral-900, #171717)", // Adjusted background
            border: "1px solid var(--neutral-700, #404040)", // Adjusted border
            "&:hover": {
              background: "var(--neutral-800, #262626)", // Adjusted background on hover
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography
          sx={{
            color: "var(--neutral-50, #FAFAFA)", // Adjusted color
            fontSize: "24px", // Adjusted font size
            fontWeight: "500", // Adjusted font weight
          }}
        >
          Settings
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "12px", // Reduced border radius
          background: "var(--neutral-900, #171717)", // Adjusted background
          border: "1px solid var(--neutral-700, #404040)", // Adjusted border
          padding: "16px",
          marginBottom: "16px",
          marginTop: "16px",
        }}
      >
        <FormControl>
          <Typography
            sx={{
              fontSize: "12px", // Adjusted font size
              fontWeight: 500, // Adjusted font weight
              lineHeight: "18px",
              color: "var(--neutral-400, #A3A3A3)", // Adjusted color
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
                control={
                  <Radio
                    color="primary"
                    sx={{
                      color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                      "&.Mui-checked": {
                        color: "#F97316", // Adjusted color
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: "var(--neutral-50, #FAFAFA)", // Adjusted color
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
              control={
                <Radio
                  color="primary"
                  sx={{
                    color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                    "&.Mui-checked": {
                      color: "#F97316", // Adjusted color
                    },
                  }}
                />
              }
              label={
                <TextField
                  value={customInputValue}
                  onChange={handleCustomInputChange}
                  placeholder="Custom option"
                  type="number"
                  inputProps={{ min: 0, max: 30 }}
                  InputLabelProps={{
                    sx: {
                      color: "var(--neutral-400, #A3A3A3) !important", // Adjusted color
                      fontSize: "14px",
                      opacity: 1,
                      textAlign: "center",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    sx: {
                      minWidth: "140px",
                      color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                      fontSize: "14px",
                      lineHeight: "16px",
                      borderRadius: "12px", // Reduced border radius
                      background: "var(--neutral-900, #171717)", // Adjusted background
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "var(--neutral-700, #404040)", // Adjusted border
                        },
                        "&:hover fieldset": {
                          borderColor: "#F97316 !important", // Adjusted border
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#F97316 !important", // Adjusted border
                        },
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
