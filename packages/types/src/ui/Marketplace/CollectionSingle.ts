import { NftListingProps } from "./Shared";

export interface CollectionSingleProps extends NftListingProps {
  name: string;
  previewImage: string | undefined;
  creator: string;
  description: string;
  onMoreClick: () => void;
  likes: number;
  onShareClick: () => void;
  onMakeCollectionOfferClick: () => void;
  floorPrice: string;
  bestOffer: string;
  volume7d: string;
  owners: string;
  forSale: string;
  total: string;
  royalities: string;
}
