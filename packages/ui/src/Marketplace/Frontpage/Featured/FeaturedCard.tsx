import React from "react";
import { FeaturedCardProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../../Shared/BaseNftCard";

const FeaturedCard = ({
  id,
  _onClick,
  image,
  name,
  price,
  volume,
  icon,
}: FeaturedCardProps) => {
  return (
    <BaseNftCard
      id={id}
      _onClick={_onClick}
      image={image}
      collectionName="" // Featured cards don't show collection name
      nftName={name}
      price={price}
      volume={volume}
      icon={icon}
      showVolume={true}
      showTrendingBadge={true}
      size="medium"
    />
  );
};

export default FeaturedCard;
