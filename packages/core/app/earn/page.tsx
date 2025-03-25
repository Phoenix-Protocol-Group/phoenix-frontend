"use client";
import { useAppStore } from "@phoenix-protocol/state";
import { useEffect } from "react";

export default function SwapPage(): JSX.Element {
  const appStore = useAppStore();

  // Loader
  useEffect(() => {
    appStore.setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
