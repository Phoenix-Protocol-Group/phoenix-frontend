import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../src/Theme";

export const withMuiTheme = (StoryFn: React.FC) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StoryFn />
    </ThemeProvider>
  );
};
