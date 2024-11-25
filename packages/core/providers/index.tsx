"use client";

import { ThemeProvider } from "@phoenix-protocol/ui";

export default function Providers({ children }: { children: any }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
