"use client";
import theme from "../Theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, Box } from "@mui/material";
import React from "react";

const PhoenixThemeProvider = ({ children }: { children: any }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          background: "linear-gradient(to bottom, #151719, #0A0B0C)",
          minWidth: "100%",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
};

export default PhoenixThemeProvider;
