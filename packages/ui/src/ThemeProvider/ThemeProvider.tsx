"use client";
import theme from "../Theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, Box } from "@mui/material";
import React from "react";

const PhoenixThemeProvider = ({ children }: { children: any }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default PhoenixThemeProvider;
