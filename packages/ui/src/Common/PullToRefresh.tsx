import React, { useState, useRef, useCallback } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { useMobileLayout } from "./useMobileLayout";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
  pullDistance?: number;
}

export type { PullToRefreshProps };

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  pullDistance = 120,
}) => {
  const { isMobile } = useMobileLayout();
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance_, setPullDistance] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isMobile) return;

      const container = containerRef.current;
      if (!container) return;

      // Only allow pull-to-refresh when scrolled to top
      if (container.scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    },
    [disabled, isMobile]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || disabled || !isMobile) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) {
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        e.preventDefault();
        const distance = Math.min(deltaY * 0.5, pullDistance);
        setPullDistance(distance);
      }
    },
    [isPulling, disabled, isMobile, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled || !isMobile) return;

    setIsPulling(false);

    if (pullDistance_ >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 300);
      }
    } else {
      setPullDistance(0);
    }
  }, [
    isPulling,
    disabled,
    isMobile,
    pullDistance_,
    threshold,
    isRefreshing,
    onRefresh,
  ]);

  const getRefreshState = () => {
    if (isRefreshing) return "refreshing";
    if (pullDistance_ >= threshold) return "release";
    if (pullDistance_ > 0) return "pull";
    return "idle";
  };

  const getRefreshText = () => {
    switch (getRefreshState()) {
      case "pull":
        return "Pull to refresh";
      case "release":
        return "Release to refresh";
      case "refreshing":
        return "Refreshing...";
      default:
        return "";
    }
  };

  const getProgressValue = () => {
    if (isRefreshing) return undefined; // Indeterminate
    return Math.min((pullDistance_ / threshold) * 100, 100);
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        position: "relative",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: pullDistance_,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pb: 1,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.1))",
          backdropFilter: "blur(10px)",
          zIndex: 10,
          transition: pullDistance_ === 0 ? "height 0.3s ease-out" : "none",
        }}
      >
        {pullDistance_ > 20 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress
              size={20}
              variant={isRefreshing ? "indeterminate" : "determinate"}
              value={getProgressValue()}
              sx={{
                color:
                  getRefreshState() === "release"
                    ? "primary.main"
                    : "text.secondary",
                transform: `rotate(${pullDistance_ * 2}deg)`,
                transition: "color 0.2s ease",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color:
                  getRefreshState() === "release"
                    ? "primary.main"
                    : "text.secondary",
                fontWeight: getRefreshState() === "release" ? 600 : 400,
                transition: "color 0.2s ease",
              }}
            >
              {getRefreshText()}
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{
          transform: `translateY(${pullDistance_}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PullToRefresh;
