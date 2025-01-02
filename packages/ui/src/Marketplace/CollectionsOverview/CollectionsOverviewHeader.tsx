import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";
import { CollectionsOverviewActiveSort } from "@phoenix-protocol/types";

function convertToCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+(\w)/g, (_, match) => match.toUpperCase());
}

const TopCollectionsHeader = ({
  label,
  active,
  setSort,
}: {
  label: string;
  active: "asc" | "desc" | false;
  setSort(sort: CollectionsOverviewActiveSort): void;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }}
    onClick={() => {
      setSort({
        column: convertToCamelCase(label) as
          | "collection"
          | "floorPrice"
          | "bestOffer"
          | "volume"
          | "owners"
          | "forSale"
          | undefined,
        direction: "desc",
      });
    }}
  >
    {label === "collection" && (
      <Typography
        sx={{
          fontSize: "10px",
          lineHeight: "200%",
          fontWeight: "700",
          opacity: "0.6",
          mr: 1,
        }}
      >
        #
      </Typography>
    )}
    <Typography
      sx={{
        fontSize: "10px",
        lineHeight: "200%",
        fontWeight: "700",
        textTransform: "uppercase",
        opacity: active ? "1" : "0.6",
      }}
    >
      {label}
    </Typography>
    {active && (
      <ArrowDownward
        sx={{
          fontSize: "14px",
          transform: active === "desc" ? "rotate(180deg)" : "none",
        }}
      />
    )}
  </Box>
);

export default TopCollectionsHeader;
