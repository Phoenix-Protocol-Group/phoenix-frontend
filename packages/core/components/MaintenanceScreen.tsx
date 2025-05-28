"use client";

import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * MaintenanceScreen Component
 * Displays a maintenance notification informing users that the app is being upgraded to V2
 */
const MaintenanceScreen: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(180deg, #1f2123 0%, #131517 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: "auto",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 2,
              background: "rgba(25, 28, 31, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <img
                  src="/icon.svg"
                  alt="Phoenix Logo"
                  style={{ height: "60px", marginBottom: "16px" }}
                />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  mb: 1,
                }}
              >
                We&apos;re Upgrading to Phoenix DeFi Hub V2
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 2,
                }}
              >
                We{"'"}ll be offline for a couple of hours while we complete the
                upgrade.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                For Updates Follow Us On
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <a
                  href="https://x.com/PhoenixDefiHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#1DA1F2",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#ffffff"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#ffffff" }}
                  >
                    @PhoenixDefiHub
                  </Typography>
                </a>
                <a
                  href="https://discord.gg/Z9mtVAktwQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#5865F2",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 127.14 96.36"
                      fill="#ffffff"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#ffffff" }}
                  >
                    Discord
                  </Typography>
                </a>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                Phoenix DeFi Hub App – V2 Changelog
              </Typography>

              <Box sx={{ pl: 2, pr: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    mb: 1,
                  }}
                >
                  UI/UX Overhaul:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                >
                  Completely redesigned the app{"'"}s look and feel with a
                  modern, advanced design. Nearly every component has been
                  adjusted for a more seamless and visually refined user
                  experience.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    mb: 1,
                  }}
                >
                  Dashboard Enhancements:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                >
                  Assets on the dashboard are now clickable, revealing in-depth
                  statistics including Volume, Price, available Trading Pairs,
                  and more.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    mb: 1,
                  }}
                >
                  New Earn Page:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 1 }}
                >
                  Introduced a brand-new earn page offering multiple earning
                  strategies.
                </Typography>
                <Box sx={{ ml: 2, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 1 }}
                  >
                    • Starting with Phoenix Pools, users can now participate in
                    automated earning mechanisms.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    • No more manual staking/unstaking of LP tokens – everything
                    is handled in a single transaction.
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    mb: 1,
                  }}
                >
                  One-Click Rewards Claiming:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                >
                  Added a feature that allows users to claim all available
                  rewards across the platform with a single click.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#ffffff",
                    mb: 1,
                  }}
                >
                  Quality of Life Improvements:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Various enhancements across the app to improve usability,
                  performance, and overall experience.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontStyle: "italic",
                }}
              >
                We appreciate your patience while we improve the Phoenix DeFi
                Hub experience.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MaintenanceScreen;
