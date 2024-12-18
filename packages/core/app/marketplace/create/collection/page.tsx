"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionDeployerContract } from "@phoenix-protocol/contracts";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { constants, Signer } from "@phoenix-protocol/utils";
import { CreateCollection } from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { PhoenixNFTCollectionContract } from "@phoenix-protocol/contracts";
import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";

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

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

  const uploadPreviewImage = async () => {
    if (!file) {
      return undefined;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/collection", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      return data.IpfsHash;
    } catch (error: any) {
      console.error("Error uploading:", error);
    }
  };

  const handleSubmitClick = async () => {
    if (!storePersist) return;

    console.log("handle");

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
          rpcUrl: constants.RPC_URL
        });

      const tx = await CollectionDeployerContract.deploy_new_collection({
        salt,
        admin: storePersist.wallet.address!,
        name,
        symbol,
      });

      const res = await tx?.signAndSend({
        signTransaction: async (xdr: string) => {
          const res = await signer.sign(xdr);
          return { signedTxXdr: res, signerAddress: storePersist.wallet.address };
        }
      });

      if (res.result) {
        const previewImageUrl = await uploadPreviewImage();

        if (previewImage) {
          const CollectionContract = new PhoenixNFTCollectionContract.Client({
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
            sender: storePersist.wallet.address!,
            uri: Buffer.from(previewImageUrl, "utf8"),
          });

          await collectionUriTx?.signAndSend({
            signTransaction: async (xdr: string) => {
              const res = await signer.sign(xdr);
              return { signedTxXdr: res, signerAddress: storePersist.wallet.address };
            }
          });

          console.log(res);
        }

        //router.push(`/marketplace/collections/${res.result}`)
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
