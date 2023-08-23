"use client";

import { NoSsr } from "@mui/material";
import { ThemeProvider } from "@phoenix-protocol/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
