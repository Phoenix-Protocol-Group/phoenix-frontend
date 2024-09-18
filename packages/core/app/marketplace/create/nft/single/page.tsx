"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionDeployerContract } from "@phoenix-protocol/contracts";
import { usePersistStore } from "@phoenix-protocol/state";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { CreateNft } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const storePersist = usePersistStore();
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

  const DeployerContract = new PhoenixNFTCollectionDeployerContract.Client({
    contractId: constants.COLLECTION_DEPLOYER_ADDRESS,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const fetchUserCollections = async () => {
    const userCollections = (await DeployerContract.query_collection_by_creator({
      creator: storePersist.wallet.address!
    })).result.unwrap();


    console.log(userCollections);
  };

  const handleSubmitClick = () => {};

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

  useEffect(() => {
    fetchUserCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address])

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
