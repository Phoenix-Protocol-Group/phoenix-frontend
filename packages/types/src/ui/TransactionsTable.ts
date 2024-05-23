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
  activeFilters: ActiveFilters;
  applyFilters: (newFilters: ActiveFilters) => void;
  loggedIn?: boolean;
}

export interface ActiveFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  tradeSize: {
    from: number | undefined;
    to: number | undefined;
  };
  tradeValue: {
    from: number | undefined;
    to: number | undefined;
  };
}
export interface FilterMenuProps {
  activeFilters: ActiveFilters;
  applyFilters: (newFilters: ActiveFilters) => void;
}
