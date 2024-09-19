"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionContract, PhoenixNFTCollectionDeployerContract } from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { TextSelectItemProps } from "@phoenix-protocol/types";
import { CreateNft } from "@phoenix-protocol/ui";
import { constants, Signer } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const store = useAppStore();
  const storePersist = usePersistStore();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [supply, setSupply] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collection, setCollection] = useState<string>("");
  const [collections, setCollections] = useState<TextSelectItemProps[]>([]);
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
    if(!storePersist.wallet.address) return;

    const userCollections = (await DeployerContract.query_collection_by_creator({
      creator: storePersist.wallet.address!
    })).result.unwrap();

    const renamedArray = userCollections.map(({ collection, name, ...rest }: {collection: string, name: string}) => ({ value: collection, label: name, ...rest }));
    setCollections(renamedArray);
  };

  const handleSubmitClick = async () => {
    try {
      const signer =
        storePersist.wallet.walletType === "wallet-connect"
          ? store.walletConnectInstance
          : new Signer();

      const CollectionContract =
        new PhoenixNFTCollectionContract.Client({
          publicKey: storePersist.wallet.address!,
          contractId: collection,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
          // @ts-ignore
          signTransaction: (tx: string) =>
            storePersist.wallet.walletType === "wallet-connect"
              ? signer.signTransaction(tx)
              : // @ts-ignore
                signer.sign(tx),
        });

      /*
      const tx = await CollectionContract.mint({
        sender: storePersist.wallet.address!,

      });
      */
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }, [file]);

  useEffect(() => {
    fetchUserCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

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
          categories={collections}
          category={collection}
          setCategory={setCollection}
          previewImage={previewImage}
          externalLink={externalLink}
          setExternalLink={setExternalLink}
          setFile={setFile}
        />
      </Box>
    </Box>
  );
}
