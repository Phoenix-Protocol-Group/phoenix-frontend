import React from "react";
import { Box, Button, Skeleton } from "@mui/material";
import { Token } from "@phoenix-protocol/types"

const AssetItem = ({}: {}) => {
  return (
    <>
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="text" width={100} height={24} />
    </>
  );
};

export default AssetItem;
