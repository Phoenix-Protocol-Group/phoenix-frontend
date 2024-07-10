export interface BackButtonProps {
  onClick: () => void;
}

export interface CollectionPreviewProps {
  image: string;
  collectionName: string;
  floorPrice: string;
  volume: string;
}

export interface CreateOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export interface ImageUploadProps {
  title: string;
  helpText?: string;
  onFileDrop: (file: File) => void;
  description1: string;
  description2?: string;
}

export type AuctionStatus = "ALL" | "NOW" | "AUCTION";
export type AuctionType = "ALL" | "MULTIPLE" | "SINGLE";

export interface NftListingProps {
  listForSaleClick?: (id: string) => void;
  nftEntries: NftListingEntryProps[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  order: string;
  orderItems: {
    value: string;
    label: string;
  }[];
  setOrder: (order: string) => void;
  activeCurrency: "crypto" | "usd";
  setActiveCurrency: (view: "crypto" | "usd") => void;
  //filter properties
  minPrice: string;
  setMinPrice: (minPrice: string) => void;
  maxPrice: string;
  setMaxPrice: (maxPrice: string) => void;
  status: AuctionStatus;
  setStatus: (status: AuctionStatus) => void;
  type: AuctionType;
  setType: (status: AuctionType) => void;
}

export interface NftListingEntryProps {
  id: string;
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  ownedBy: string;
  listForSale?: boolean;
  _listForSaleClick?: (id: string) => void; //use listForSaleClick in NftListingProps
}

export interface NftPreviewProps {
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  ownedBy: string;
}

export interface TextInputProps {
  label?: string;
  helpText?: string;
  placeholder: string;
  name?: string; //optional for grouped input onChange Events
  value: string;
  onChange: (val: string, name?: string) => void;
}

export interface TextInputProps {
  label?: string;
  helpText?: string;
  placeholder: string;
  name?: string; //optional for grouped input onChange Events
  value: string;
  onChange: (val: string, name?: string) => void;
}

export interface TextSelectItemProps {
  label: string;
  value: string;
}

export interface TextSelectProps {
  label: string;
  helpText?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  items: TextSelectItemProps[];
}
