"use client";

import { ThemeProvider } from "@phoenix-protocol/ui";
import { ToastProvider } from "./ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
