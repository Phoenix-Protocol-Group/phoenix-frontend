import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Button } from "../../../Button/Button";
import { NftListingEntryProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../BaseNftCard";

const NftListingEntry = (props: NftListingEntryProps) => {
  const bottomContent = props.listForSale ? (
    <Button
      sx={{
        width: "100%",
        py: 1,
        fontSize: "0.875rem",
        fontWeight: 700,
      }}
      label="List For Sale"
      onClick={(event: any) => {
        event.stopPropagation();
        props._listForSaleClick?.(props.id);
      }}
    />
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography
          sx={{
            fontSize: "0.65rem",
            color: "#A3A3A3",
            mb: 0.5,
            fontFamily: "Ubuntu, sans-serif",
          }}
        >
          Price
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            component="img"
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
            }}
            alt="PHO"
            src="/cryptoIcons/pho.svg"
          />
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#FAFAFA",
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
            fontSize: "0.65rem",
            color: "#A3A3A3",
            mb: 0.5,
            fontFamily: "Ubuntu, sans-serif",
            textAlign: "right",
          }}
        >
          Owned by
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#FAFAFA",
            fontFamily: "Ubuntu, sans-serif",
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
  );

  return (
    <BaseNftCard
      id={props.id}
      _onClick={() => {}} // Handled by parent component
      image={props.image}
      collectionName={props.collectionName}
      nftName={props.nftName}
      showVolume={false}
      bottomContent={bottomContent}
      size="small"
    />
  );
};
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
