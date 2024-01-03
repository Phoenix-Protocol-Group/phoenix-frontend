import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Radio,
  RadioGroup,
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
            Select slippage tolerance
          </Typography>
          <RadioGroup defaultValue={selectedOption} onChange={onChange}>
            {options.map((option, index) => (
              <FormControlLabel
                value={index}
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
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export { SlippageSettings };
