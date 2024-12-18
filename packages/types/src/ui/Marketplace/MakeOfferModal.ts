import { TextSelectItemProps } from "./Shared";

export interface MakeOfferProps {
  open: boolean;
  onClose: () => void;
  nftName: string;
  price: string;
  priceUsd: string;
  collectionName: string;
  balance: string;
  floorPrice: string;
  bestOffer: string;
  offerAmount: string;
  onOfferAmountChange: (offerAmount: string) => void;
  duration: string;
  durationOptions: TextSelectItemProps[];
  setDuration: (duration: string) => void;
  onMakeOfferClick: () => void;
  onBuyPhoClick: () => void;
}
