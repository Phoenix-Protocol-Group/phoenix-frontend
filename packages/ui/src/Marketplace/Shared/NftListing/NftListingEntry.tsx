import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../../Button/Button";
import { NftListingEntryProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
} from "../../../Theme/styleConstants";

const NftListingEntry = (props: NftListingEntryProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Box
        sx={{
          ...cardStyles.base,
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          transition: "all 0.3s ease",
          "&:hover": {
            border: `1px solid ${colors.primary.main}60`,
            boxShadow: `0 8px 32px ${colors.primary.main}20`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${colors.primary.main}03 0%, ${colors.primary.dark}02 100%)`,
            borderRadius: borderRadius.lg,
            pointerEvents: "none",
            zIndex: 1,
          },
        }}
      >
        {/* NFT Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%", // 1:1 Aspect Ratio
            overflow: "hidden",
            borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
          }}
        >
          <Box
            component="img"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            alt={props.nftName}
            src={props.image}
          />

          {/* NFT ID Badge */}
          <Box
            sx={{
              position: "absolute",
              top: spacing.sm,
              right: spacing.sm,
              px: spacing.sm,
              py: spacing.xs,
              borderRadius: borderRadius.sm,
              background: `rgba(0, 0, 0, 0.7)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.neutral[600]}`,
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.bold,
                fontFamily: "monospace",
              }}
            >
              #{props.id}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            p: spacing.md,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Collection Name */}
          <Typography
            sx={{
              color: colors.neutral[400],
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeights.medium,
              fontFamily: typography.fontFamily,
              mb: spacing.xs,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {props.collectionName}
          </Typography>

          {/* NFT Name */}
          <Typography
            sx={{
              color: colors.neutral[50],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.bold,
              fontFamily: typography.fontFamily,
              mb: spacing.md,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.nftName}
          </Typography>

          {/* Price and Owner Information */}
          {props.listForSale ? (
            <Button
              sx={{
                width: "100%",
                py: spacing.sm,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.bold,
              }}
              label="List For Sale"
              onClick={(event: any) => {
                event.stopPropagation();
                props._listForSaleClick?.(props.id);
              }}
            />
          ) : (
            <Grid container spacing={spacing.sm}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.medium,
                    fontFamily: typography.fontFamily,
                    mb: spacing.xs,
                  }}
                >
                  Price
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                    }}
                    alt="PHO"
                    src="/cryptoIcons/pho.svg"
                  />
                  <Typography
                    sx={{
                      color: colors.neutral[50],
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.semiBold,
                      fontFamily: "monospace",
                    }}
                  >
                    {props.price}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.medium,
                    fontFamily: typography.fontFamily,
                    mb: spacing.xs,
                    textAlign: "right",
                  }}
                >
                  Owned by
                </Typography>
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.semiBold,
                    fontFamily: typography.fontFamily,
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {props.ownedBy}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default NftListingEntry;
