import {
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export interface TextSelectItemProps {
  label: string;
  value: string;
}

export interface TextSelectProps {
  label: string;
  helpText?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  items: TextSelectItemProps[];
}

const TextSelect = (props: TextSelectProps) => {
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
                ml: 1,
                fontSize: "16px",
                position: "relative",
                top: 3,
                "&:hover": { color: "#FFF" },
              }}
            />
          </Tooltip>
        )}
      </Typography>
      <FormControl
        sx={{
          minWidth: 120,
          width: "100%",
          "& .MuiSelect-outlined": {
            padding: "14px 8px 14px 16px !important",
          },
        }}
      >
        <Select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          renderValue={(selected: string) => {
            if (!selected) {
              return props.placeholder;
            }

            return props.items.find(item => item.value === selected).label;
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{ borderRadius: "16px", opacity: 0.6, fontSize: "14px", "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E2621B !important"
          } }}
        >
          {props.items.map((item: TextSelectItemProps, index: number) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default TextSelect;
