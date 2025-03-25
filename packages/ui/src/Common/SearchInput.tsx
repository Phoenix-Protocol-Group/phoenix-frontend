import React from "react";
import { Box, Input, InputProps } from "@mui/material";
import { colors, borderRadius, typography, spacing } from "../Theme/styleConstants";

interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search", 
  sx = {}, 
  ...props 
}: SearchInputProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        width: "100%",
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.neutral[700]}`,
        background: colors.neutral[800],
        padding: `${spacing.xs} ${spacing.md}`,
        color: colors.neutral[300],
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily,
        "&:before, &:after": { content: "none" },
        ...sx,
      }}
      startAdornment={
        <Box
          component="img"
          style={{ marginRight: spacing.sm, opacity: 0.6 }}
          src="/MagnifyingGlass.svg"
          alt="Search"
        />
      }
      {...props}
    />
  );
};
