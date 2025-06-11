export interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  nftName: string;
  price: string;
  priceUsd: string;
  collectionName: string;
  phoenixFee: string;
  bestOffer: string;
  quantity: string;
  onQuantityChange: (val: string) => void;
  onMakeOfferClick: () => void;
  onBuyPhoClick: () => void;
}
