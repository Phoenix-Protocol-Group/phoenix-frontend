import React from "react";
import { NftCategoriesCardProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../../Shared/BaseNftCard";

const NftCategoriesCard = (props: NftCategoriesCardProps) => {
  return (
    <BaseNftCard
      id={props.id}
      _onClick={props._onClick}
      image={props.image}
      collectionName=""
      nftName={props.name}
      showVolume={false}
      bottomContent={null} // Categories only show the name
      aspectRatio="4/3" // Categories use a different aspect ratio
      size="medium"
    />
  );
};

export default NftCategoriesCard;
