import { Currency, TextSelectItemProps } from "./Shared";

export interface CollectionsOverviewEntryProps {
  _number?: number; //used to display numbers
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

export interface CollectionsOverviewActiveSort {
  column:
    | "collection"
    | "floorPrice"
    | "bestOffer"
    | "volume"
    | "owners"
    | "forSale"
    | undefined;
  direction: "asc" | "desc";
}

export type CollectionsOverviewTimeOptions = "6h" | "1d" | "7d" | "30d";

export interface CollectionsOverviewProps {
  entries: CollectionsOverviewEntryProps[];
  onEntryClick: (id: string) => void;
  activeSort: CollectionsOverviewActiveSort;
  setSort: (sort: CollectionsOverviewActiveSort) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  category: string;
  categoryItems: TextSelectItemProps[];
  setCategory: (category: string) => void;
  activeCurrency: Currency;
  setActiveCurrency: (view: Currency) => void;
  activeTime: CollectionsOverviewTimeOptions;
  setActiveTime: (time: CollectionsOverviewTimeOptions) => void;
}
