export interface FeaturedCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  name: string;
  price: string;
  volume: string;
  icon: string;
}

export interface FeaturedProps {
  entries: FeaturedCardProps[];
  onEntryClick: (id: string) => void;
  forwardClick?: () => void;
  backwardClick?: () => void;
}

export interface TopCollectionsEntryProps {
  _key?: number; //only used for loop key
  _onClick?: (id: string) => void; //used to trigger onEntryClick
  id: string;
  previewImage: string;
  collectionName: string;
  floorPrice: string;
  bestOffer: string;
  volume: string;
  volumePercent?: string;
  owners: string;
  ownersPercent?: string;
  forSalePercent: string;
  forSaleNumbers: string;
}

export interface TopCollectionsProps {
  entries: TopCollectionsEntryProps[];
  onEntryClick: (id: string) => void;
  activeSort: {
    column:
      | "collection"
      | "floorPrice"
      | "bestOffer"
      | "volume"
      | "owners"
      | "forSale"
      | undefined;
    direction: "asc" | "desc";
  };
  handleSort: (column: string) => void;
  activeCurrency: "crypto" | "usd";
  setActiveCurrency: (view: "crypto" | "usd") => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
  onViewAllClick: () => void;
}

export interface PopularNftCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  volume: string;
  icon: string;
}

export interface PopularNftsProps {
  entries: PopularNftCardProps[];
  onEntryClick: (id: string) => void;
  forwardClick?: () => void;
  backwardClick?: () => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
  onViewAllClick: () => void;
}

export interface RisingStarCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  collectionName: string;
  percent: number;
}

export interface RisingStarsProps {
  entries: RisingStarCardProps[];
  onEntryClick: (id: string) => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
}

export interface NftCategoriesCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  name: string;
}

export interface NftCategoriesProps {
  entries: NftCategoriesCardProps[];
  onEntryClick: (id: string) => void;
  onViewAllClick: () => void;
}

export interface GettingStartedCardProps {
  image: string;
  name: string;
  description: string;
}

export interface GettingStartedProps {
  entries: GettingStartedCardProps[];
  onViewAllClick: () => void;
}

export interface FrontpageProps {
  featuredProps: FeaturedProps;
  topCollectionsProps: TopCollectionsProps;
  popularNftsProps: PopularNftsProps;
  risingStarsProps: RisingStarsProps;
  nftCategoriesProps: NftCategoriesProps;
  gettingStartedProps: GettingStartedProps;
}
