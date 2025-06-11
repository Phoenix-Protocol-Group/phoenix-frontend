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

export default NftListingEntry;
