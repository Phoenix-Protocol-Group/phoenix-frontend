export interface NftSingleProps {
  listForSale?: boolean;
  listForSaleClick?: () => void;
  onBuyNowClick: () => void;
  onMakeOfferClick: () => void;
  previewImage: string;
  collectionName: string;
  nftName: string;
  nftDescription: string;
  lastSale: string;
  bestOffer: string;
  floorPrice: string;
  owner: string;
  auctionEnds: Date;
  availableSupply: string;
  totalSupply: string;
  price: string;
  priceUsd: string;
}
