import React from "react";
import { Box, Skeleton, Stack, Card, useTheme } from "@mui/material";
import { useMobileLayout } from "./useMobileLayout";

export interface MobileSkeletonProps {
  variant?: "card" | "list" | "pool" | "dashboard" | "swap";
  count?: number;
  height?: number | string;
  width?: number | string;
  animation?: "pulse" | "wave" | false;
}

/**
 * MobileSkeleton - A component that provides skeleton loading states optimized for mobile
 *
 * Features:
 * - Mobile-optimized skeleton layouts
 * - Multiple variants for different page types
 * - Responsive sizing and spacing
 * - Smooth animations
 */
export const MobileSkeleton: React.FC<MobileSkeletonProps> = ({
  variant = "card",
  count = 1,
  height,
  width,
  animation = "wave",
}) => {
  const theme = useTheme();
  const { isMobile, spacing } = useMobileLayout();

  const renderCardSkeleton = () => (
    <Card
      sx={{
        p: spacing.md,
        mb: spacing.sm,
        borderRadius: isMobile ? 2 : 3,
      }}
    >
      <Stack spacing={spacing.sm}>
        <Skeleton
          variant="text"
          height={24}
          width="60%"
          animation={animation}
        />
        <Skeleton
          variant="rectangular"
          height={height || (isMobile ? 120 : 150)}
          animation={animation}
        />
        <Stack direction="row" spacing={spacing.xs}>
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            animation={animation}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={20}
            animation={animation}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box
      sx={{
        p: spacing.sm,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" spacing={spacing.sm} alignItems="center">
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          animation={animation}
        />
        <Stack flex={1} spacing={spacing.xs}>
          <Skeleton
            variant="text"
            height={20}
            width="80%"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height={16}
            width="60%"
            animation={animation}
          />
        </Stack>
        <Skeleton
          variant="text"
          height={20}
          width="20%"
          animation={animation}
        />
      </Stack>
    </Box>
  );

  const renderPoolSkeleton = () => (
    <Card
      sx={{
        p: spacing.md,
        mb: spacing.sm,
        borderRadius: isMobile ? 2 : 3,
      }}
    >
      <Stack spacing={spacing.md}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={spacing.sm} alignItems="center">
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              animation={animation}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              animation={animation}
            />
            <Skeleton
              variant="text"
              height={24}
              width={100}
              animation={animation}
            />
          </Stack>
          <Skeleton
            variant="text"
            height={20}
            width={60}
            animation={animation}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={spacing.xs}>
            <Skeleton
              variant="text"
              height={16}
              width={80}
              animation={animation}
            />
            <Skeleton
              variant="text"
              height={24}
              width={120}
              animation={animation}
            />
          </Stack>
          <Stack spacing={spacing.xs} alignItems="flex-end">
            <Skeleton
              variant="text"
              height={16}
              width={60}
              animation={animation}
            />
            <Skeleton
              variant="text"
              height={24}
              width={100}
              animation={animation}
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={spacing.sm}>
          <Skeleton
            variant="rectangular"
            height={isMobile ? 40 : 44}
            sx={{ flex: 1, borderRadius: 1 }}
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            height={isMobile ? 40 : 44}
            sx={{ flex: 1, borderRadius: 1 }}
            animation={animation}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderDashboardSkeleton = () => (
    <Stack spacing={spacing.md}>
      {/* Portfolio Overview */}
      <Card sx={{ p: spacing.md, borderRadius: isMobile ? 2 : 3 }}>
        <Stack spacing={spacing.sm}>
          <Skeleton
            variant="text"
            height={20}
            width="50%"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height={36}
            width="80%"
            animation={animation}
          />
          <Stack direction="row" spacing={spacing.md}>
            <Skeleton
              variant="text"
              height={20}
              width="30%"
              animation={animation}
            />
            <Skeleton
              variant="text"
              height={20}
              width="30%"
              animation={animation}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Quick Actions */}
      <Stack direction="row" spacing={spacing.sm}>
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            variant="rectangular"
            height={isMobile ? 60 : 80}
            sx={{ flex: 1, borderRadius: 2 }}
            animation={animation}
          />
        ))}
      </Stack>

      {/* Recent Activity */}
      <Card sx={{ p: spacing.md, borderRadius: isMobile ? 2 : 3 }}>
        <Stack spacing={spacing.sm}>
          <Skeleton
            variant="text"
            height={24}
            width="40%"
            animation={animation}
          />
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ py: spacing.sm }}>
              <Stack direction="row" spacing={spacing.sm} alignItems="center">
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  animation={animation}
                />
                <Stack flex={1} spacing={spacing.xs}>
                  <Skeleton
                    variant="text"
                    height={16}
                    width="70%"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height={14}
                    width="50%"
                    animation={animation}
                  />
                </Stack>
                <Skeleton
                  variant="text"
                  height={16}
                  width="20%"
                  animation={animation}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
    </Stack>
  );

  const renderSwapSkeleton = () => (
    <Card
      sx={{
        p: spacing.md,
        maxWidth: isMobile ? "100%" : 480,
        mx: "auto",
        borderRadius: isMobile ? 2 : 3,
      }}
    >
      <Stack spacing={spacing.md}>
        <Skeleton
          variant="text"
          height={28}
          width="30%"
          animation={animation}
        />

        {/* From Token */}
        <Box
          sx={{
            p: spacing.md,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Stack spacing={spacing.sm}>
            <Skeleton
              variant="text"
              height={16}
              width="20%"
              animation={animation}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="text"
                height={32}
                width="40%"
                animation={animation}
              />
              <Stack direction="row" spacing={spacing.sm} alignItems="center">
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={60}
                  animation={animation}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Swap Icon */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation={animation}
          />
        </Box>

        {/* To Token */}
        <Box
          sx={{
            p: spacing.md,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Stack spacing={spacing.sm}>
            <Skeleton
              variant="text"
              height={16}
              width="15%"
              animation={animation}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="text"
                height={32}
                width="40%"
                animation={animation}
              />
              <Stack direction="row" spacing={spacing.sm} alignItems="center">
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width={60}
                  animation={animation}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Swap Button */}
        <Skeleton
          variant="rectangular"
          height={isMobile ? 48 : 52}
          sx={{ borderRadius: 2 }}
          animation={animation}
        />

        {/* Swap Details */}
        <Stack spacing={spacing.sm}>
          {[1, 2, 3].map((item) => (
            <Stack key={item} direction="row" justifyContent="space-between">
              <Skeleton
                variant="text"
                height={16}
                width="40%"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height={16}
                width="30%"
                animation={animation}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case "list":
        return renderListSkeleton();
      case "pool":
        return renderPoolSkeleton();
      case "dashboard":
        return renderDashboardSkeleton();
      case "swap":
        return renderSwapSkeleton();
      case "card":
      default:
        return renderCardSkeleton();
    }
  };

  if (variant === "dashboard" || variant === "swap") {
    return <>{renderSkeleton()}</>;
  }

  return (
    <Box sx={{ width }}>
      {Array.from({ length: count }, (_, index) => (
        <Box key={index}>{renderSkeleton()}</Box>
      ))}
    </Box>
  );
};

export default MobileSkeleton;
