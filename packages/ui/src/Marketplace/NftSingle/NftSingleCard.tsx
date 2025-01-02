import { Box } from "@mui/material";
import React from "react";

export interface NftSingleCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const NftSingleCard = (props: NftSingleCardProps) => {
  return <Box sx={{
    p: 3,
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
    border: "1px solid #2D303A",
    borderRadius: "16px"
  }}>{props.children}</Box>;
};

export default NftSingleCard;
