"use client";

import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component that renders its children only on the client-side
 * to prevent hydration mismatch errors with client-specific code.
 *
 * @param {ClientOnlyProps} props - The component props
 * @param {ReactNode} props.children - Content to render on client-side
 * @param {ReactNode} props.fallback - Optional fallback content during SSR
 */
export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
