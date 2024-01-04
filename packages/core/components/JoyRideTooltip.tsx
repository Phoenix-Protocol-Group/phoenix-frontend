"use client";
import { Box, Typography } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Button } from "@phoenix-protocol/ui";
import React, { useEffect, useState } from "react";
import { TooltipRenderProps } from "react-joyride";

const JoyRideTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) => {
  const containerStyle = {
    display: "flex",
    padding: "1rem",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1rem",
    borderRadius: "0.75rem",
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    maxWidth: "19rem",
  };

  const headingStyle = {
    color: "white",
    fontFamily: "Ubuntu",
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: "normal",
  };

  const contentStyle = {
    color: "white",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.5rem",
  };

  const appStorePersist = usePersistStore();
  const appStore = useAppStore();

  const onSkipTour = () => {
    appStorePersist.skipUserTour();
    appStorePersist.setUserTourActive(false);
    appStore.setTourRunning(false);
  };

  return (
    <Box {...tooltipProps} sx={containerStyle}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Typography
          sx={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Ubuntu",
            fontSize: "0.625rem",
            fontWeight: 700,
            lineHeight: "1.25rem",
          }}
        >
          STEP {index + 1} OF 10
        </Typography>
        <Typography
          onClick={onSkipTour}
          sx={{
            color: "white",
            fontFamily: "Ubuntu",
            fontSize: "0.625rem",
            fontWeight: 700,
            lineHeight: "1.25rem",
            cursor: "pointer",
          }}
        >
          SKIP TOUR
        </Typography>
      </Box>
      {step.title && <Typography sx={headingStyle}>{step.title}</Typography>}
      <Box>
        <Typography sx={contentStyle}>{step.content}</Typography>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {continuous && (
          <Button
            {...primaryProps}
            label={index == 9 ? "Finish Tour" : "Next"}
          />
        )}
      </Box>
    </Box>
  );
};

export default JoyRideTooltip;
