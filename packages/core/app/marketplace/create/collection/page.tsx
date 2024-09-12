"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionDeployerContract } from "@phoenix-protocol/contracts";
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

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

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
          contractId:
            "CDH7YFXQFAHAFIPH64SC77WWD2RTII3XK6SVESRUHFBAHFWFJYNMKKSY", //@todo move to constants
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

      if(res.result) {
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
