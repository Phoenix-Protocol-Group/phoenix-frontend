import { TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export interface TextInputProps {
  label: string;
  helpText?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

const TextInput = (props: TextInputProps) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: "12px",
          lineHeight: "17px",
          mb: 1.5,
          color: "#BFBFBF",
        }}
      >
        {props.label}{" "}
        {props.helpText && (
          <Tooltip title={props.helpText}>
            <HelpOutlineIcon
              sx={{
                ml: 2,
                fontSize: "16px",
                position: "relative",
                top: 3,
                "&:hover": { color: "#FFF" },
              }}
            />
          </Tooltip>
        )}
      </Typography>
      <TextField
        value={props.value}
        placeholder={props.placeholder}
        sx={{
          color: "white",
          width: "100%",
          "&::placeholder": {
            fontSize: "14px",
            color: "white",
            opacity: 0.4,
          },
          "& .MuiInputBase-input": {
            padding: "14px 8px 14px 16px !important",
          },
        }}
        onChange={(e) => props.onChange(e.target.value)}
        InputLabelProps={{
          sx: {
            color: "white!important",
            fontSize: "0.8125rem",
            opacity: 0.6,
            textAlign: "center",
          },
        }}
        InputProps={{
          sx: {
            color: "white",
            fontSize: "14px",
            opacity: 0.6,
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
    </>
  );
};

export default TextInput;
