import React from "react";
import { PopularNftCardProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../../Shared/BaseNftCard";

const PopularNftsCard = (props: PopularNftCardProps) => {
  return (
    <BaseNftCard
      id={props.id}
      _onClick={props._onClick}
      image={props.image}
      collectionName={props.collectionName}
      nftName={props.nftName}
      price={props.price}
      volume={props.volume}
      icon={props.icon}
      showVolume={true}
      size="medium"
    />
  );
};

export default PopularNftsCard;
