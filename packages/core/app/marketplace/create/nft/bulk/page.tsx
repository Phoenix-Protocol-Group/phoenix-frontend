"use client";

import { Box, Typography } from "@mui/material";
import { CreateNftBulkEntryProps, TextSelectItemProps } from "@phoenix-protocol/types";
import { CreateNftBulk } from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockFile = new File([""], "/nftPreview.png", { type: "image/png" });

export default function Page() {
  const router = useRouter();

  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<TextSelectItemProps[]>([]);
  const [entries, setEntries] = useState<CreateNftBulkEntryProps[]>([]);

  const handleSubmitClick = () => {};

  return (
    <Box
      sx={{
        pt: 1.2,
        width: "100%",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: 700,
          mb: 6,
        }}
      >
        Create
      </Typography>
      <Box mx={2}>
        <CreateNftBulk
          onBackButtonClick={() => {
            router.back();
          }}
          onSubmitClick={handleSubmitClick}
          onCreateCollectionClick={() => {
            router.push("/marketplace/create/collection");
          }}
          categories={categories}
          category={category}
          setCategory={setCategory}
          entries={entries}
          setEntries={setEntries}
        />
      </Box>
    </Box>
  );
}
