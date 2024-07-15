"use client";

import { Box, Typography } from "@mui/material";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { CreateNft } from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [supply, setSupply] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<TextSelectItemProps[]>([]);
  const [file, setFile] = useState<File | undefined>();
  const [externalLink, setExternalLink] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

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
        Marketplace
      </Typography>
      <Box mx={2}>
        <CreateNft
          onBackButtonClick={() => {
            router.back();
          }}
          onSubmitClick={handleSubmitClick}
          onCreateCollectionClick={() => {
            router.push("/marketplace/create/collection");
          }}
          name={name}
          setName={setName}
          supply={supply}
          setSupply={setSupply}
          description={description}
          setDescription={setDescription}
          categories={categories}
          category={category}
          setCategory={setCategory}
          previewImage={previewImage}
          externalLink={externalLink}
          setExternalLink={setExternalLink}
          setFile={setFile}
        />
      </Box>
    </Box>
  );
}
