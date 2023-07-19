"use client";

import { ThemeProvider } from "@phoenix-protocol/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
