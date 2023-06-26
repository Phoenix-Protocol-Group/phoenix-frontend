"use client";
import React, { createContext } from "react";
import { freighter } from "@phoenix-protocol/state";
import * as SorobanClient from "soroban-client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = "Phoenix Demo UI";
  const chains = [
    {
      id: "futurenet",
      name: "Futurenet",
      networkPassphrase: SorobanClient.Networks.FUTURENET,
    },
  ];
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const allowedConnectors = [freighter()];

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
