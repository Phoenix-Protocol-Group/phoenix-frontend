import { Token } from "../general";

export interface TransactionTableEntryProps {
  type: "Success" | "Failed";
  assets: Token[];
  tradeSize: string;
  tradeValue: string;
  date: string;
  txHash: string;
}

export interface TransactionsTableProps {
  entries: TransactionTableEntryProps[];
  activeSort: {
    column:
      | "tradeType"
      | "asset"
      | "tradeSize"
      | "tradeValue"
      | "date"
      | "actions"
      | undefined;
    direction: "asc" | "desc";
  };
  handleSort: (column: string) => void;
  activeView: "personal" | "all";
  setActiveView: (view: "personal" | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loadingResults: boolean;
  activeFilters: ActiveFilters;
  applyFilters: (newFilters: ActiveFilters) => void;
  loggedIn?: boolean;
}

export interface ActiveFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  tradeSize: {
    from: number;
    to: number;
  };
  tradeValue: {
    from: number;
    to: number;
  };
}
export interface FilterMenuProps {
  activeFilters: ActiveFilters;
  applyFilters: (newFilters: ActiveFilters) => void;
}
