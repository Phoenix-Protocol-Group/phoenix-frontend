"use client";

import { Box, Typography } from "@mui/material";
import { PinataSDK } from "pinata";
import {
  PhoenixNFTCollectionDeployerContract,
  PhoenixNFTMintContract,
} from "@phoenix-protocol/contracts";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { constants, Signer } from "@phoenix-protocol/utils";
import { CreateCollection } from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";

export default function Page() {
  const store = useAppStore();
  const storePersist = usePersistStore();
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

  const pinata = new PinataSDK({
    pinataJwt: //@todo must be moved to server side place
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Mjk1ZmIzNy1jYmU3LTQ0YTYtYmU1OS0yNTE0MTg5ZTc1YTYiLCJlbWFpbCI6InZhcm5vdHVzZWRAcHJvdG9ubWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTYwZDY3YmM5NThjZTYwNTc5YjMiLCJzY29wZWRLZXlTZWNyZXQiOiJiMzlhM2MwOTRiZGQwMDk4OWYzYmY4ODk1MzE0NDk2MjljM2U4MDEwZjNmYzJjM2Q1NjBmNDMzZDZjZjAxOWFjIiwiaWF0IjoxNzI2NDk0OTA3fQ.g98zhDPGIzNwKk2H4PlxQDWQLH7X9YK_BYhX1LvpJiA",
    pinataGateway: "lime-genetic-whitefish-192.mypinata.cloud",
  });

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

  const uploadPreviewImage = async () => {
    if (!file) {
      return undefined;
    }

    const upload = await pinata.upload.file(file);
    return upload;
  };

  const handleSubmitClick = async () => {
    if (!storePersist) return;

    const randomBytes = new Uint8Array(32);
    const random = crypto.getRandomValues(randomBytes);

    const salt = Buffer.from(random);

    try {
      const signer =
        storePersist.wallet.walletType === "wallet-connect"
          ? store.walletConnectInstance
          : new Signer();

      const CollectionDeployerContract =
        new PhoenixNFTCollectionDeployerContract.Client({
          publicKey: storePersist.wallet.address!,
          contractId: constants.COLLECTION_DEPLOYER_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
          // @ts-ignore
          signTransaction: (tx: string) =>
            storePersist.wallet.walletType === "wallet-connect"
              ? signer.signTransaction(tx)
              : // @ts-ignore
                signer.sign(tx),
        });

      const tx = await CollectionDeployerContract.deploy_new_collection({
        salt,
        admin: storePersist.wallet.address!,
        name,
        symbol,
      });

      const res = await tx?.signAndSend();

      if (res.result) {
        const previewImage = await uploadPreviewImage();
        console.log(previewImage);

        if (previewImage) {
          const CollectionContract = new PhoenixNFTMintContract.Client({
            publicKey: storePersist.wallet.address!,
            contractId: res.result,
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            rpcUrl: constants.RPC_URL,
            // @ts-ignore
            signTransaction: (tx: string) =>
              storePersist.wallet.walletType === "wallet-connect"
                ? signer.signTransaction(tx)
                : // @ts-ignore
                  signer.sign(tx),
          });

          const collectionUriTx = await CollectionContract.set_collection_uri({
            uri: Buffer.from(previewImage.cid, "utf8"),
          });

          const collectionUriRes = await collectionUriTx?.signAndSend();
        }

        router.push(`/marketplace/collections/${res.result}`)
      }
    } catch (e) {
      console.error(e);
    }
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
        Create
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
