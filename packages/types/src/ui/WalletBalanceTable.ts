import { Token, TokenWithVestedAmount } from "../general";

export interface FilterAndTabPanelProps {
  categories: string[];
  searchTerm: string;
  sort: string;
  category: string;
  setCategory: (category: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSort: (sort: "highest" | "lowest") => void;
  isMobile: boolean;
}
export interface ListItemProps {
  token: Token | TokenWithVestedAmount;
}
export interface WalletBalanceTableProps {
  tokens: Token[] | TokenWithVestedAmount[];
}
