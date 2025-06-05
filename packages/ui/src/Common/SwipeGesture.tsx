import React, { useRef, useCallback, useState } from "react";
import { Box } from "@mui/material";
import { useMobileLayout } from "./useMobileLayout";

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocity?: number;
  disabled?: boolean;
  preventDefaultOn?: ("left" | "right" | "up" | "down")[];
}

export type { SwipeGestureProps };

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.3,
  disabled = false,
  preventDefaultOn = [],
}) => {
  const { isMobile } = useMobileLayout();
  const startTouch = useRef<TouchPoint | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isMobile) return;

      const touch = e.touches[0];
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsDragging(true);
    },
    [disabled, isMobile]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !startTouch.current || disabled || !isMobile) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;

      // Determine swipe direction based on larger delta
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (absX > threshold / 2) {
          const direction = deltaX > 0 ? "right" : "left";
          if (preventDefaultOn.includes(direction)) {
            e.preventDefault();
          }
        }
      } else {
        // Vertical swipe
        if (absY > threshold / 2) {
          const direction = deltaY > 0 ? "down" : "up";
          if (preventDefaultOn.includes(direction)) {
            e.preventDefault();
          }
        }
      }
    },
    [isDragging, disabled, isMobile, threshold, preventDefaultOn]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !startTouch.current || disabled || !isMobile) {
        setIsDragging(false);
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;
      const deltaTime = Date.now() - startTouch.current.time;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const velocityX = absX / deltaTime;
      const velocityY = absY / deltaTime;

      // Determine if swipe meets threshold and velocity requirements
      const isValidSwipe = (delta: number, vel: number) =>
        Math.abs(delta) > threshold && vel > velocity;

      // Determine swipe direction based on larger delta
      if (absX > absY) {
        // Horizontal swipe
        if (isValidSwipe(deltaX, velocityX)) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (isValidSwipe(deltaY, velocityY)) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      setIsDragging(false);
      startTouch.current = null;
    },
    [
      isDragging,
      disabled,
      isMobile,
      threshold,
      velocity,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
    ]
  );

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        touchAction: "pan-x pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

// Hook for easier swipe handling
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  options?: {
    threshold?: number;
    velocity?: number;
    disabled?: boolean;
  }
) => {
  const { isMobile } = useMobileLayout();
  const startTouch = useRef<TouchPoint | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { threshold = 50, velocity = 0.3, disabled = false } = options || {};

  const handlers = {
    onTouchStart: useCallback(
      (e: React.TouchEvent) => {
        if (disabled || !isMobile) return;

        const touch = e.touches[0];
        startTouch.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
        setIsDragging(true);
      },
      [disabled, isMobile]
    ),

    onTouchEnd: useCallback(
      (e: React.TouchEvent) => {
        if (!isDragging || !startTouch.current || disabled || !isMobile) {
          setIsDragging(false);
          return;
        }

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startTouch.current.x;
        const deltaY = touch.clientY - startTouch.current.y;
        const deltaTime = Date.now() - startTouch.current.time;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const velocityX = absX / deltaTime;
        const velocityY = absY / deltaTime;

        const isValidSwipe = (delta: number, vel: number) =>
          Math.abs(delta) > threshold && vel > velocity;

        if (absX > absY) {
          if (isValidSwipe(deltaX, velocityX)) {
            if (deltaX > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          }
        } else {
          if (isValidSwipe(deltaY, velocityY)) {
            if (deltaY > 0 && onSwipeDown) {
              onSwipeDown();
            } else if (deltaY < 0 && onSwipeUp) {
              onSwipeUp();
            }
          }
        }

        setIsDragging(false);
        startTouch.current = null;
      },
      [
        isDragging,
        disabled,
        isMobile,
        threshold,
        velocity,
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
      ]
    ),
  };

  return isMobile ? handlers : {};
};

export default SwipeGesture;
