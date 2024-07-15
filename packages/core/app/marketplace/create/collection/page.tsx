"use client";

import { Box, Typography } from "@mui/material";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { CreateCollection } from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<TextSelectItemProps[]>([]);
  const [file, setFile] = useState<File | undefined>();
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if(!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

  const handleSubmitClick = () => {

  };

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
        Marketplace
      </Typography>
      <Box mx={2}>
        <CreateCollection
          onBackButtonClick={() => {
            router.back();
          }}
          onSubmitClick={handleSubmitClick}
          name={name}
          setName={setName}
          symbol={symbol}
          setSymbol={setSymbol}
          description={description}
          setDescription={setDescription}
          categories={categories}
          category={category}
          setCategory={setCategory}
          previewImage={previewImage}
          setFile={setFile}
        />
      </Box>
    </Box>
  );
}
