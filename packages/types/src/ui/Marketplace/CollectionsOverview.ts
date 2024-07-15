export interface CollectionsOverviewEntryProps {
  _key?: number; //used for key and index number next to collection name
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

export interface CollectionsOverviewProps {
  entries: CollectionsOverviewEntryProps[];
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
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  category: string;
  categoryItems: {
    value: string;
    label: string;
  }[];
  setCategory: (category: string) => void;
  handleSort: (column: string) => void;
  activeCurrency: "crypto" | "usd";
  setActiveCurrency: (view: "crypto" | "usd") => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
}
