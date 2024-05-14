import { Token } from "../general";

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

interface TokenWithInfo extends Token {
  contractId: string;
}
export interface ListItemProps {
  token: TokenWithInfo;
  onTokenClick: (tokenAddress: string) => void;
}
export interface WalletBalanceTableProps {
  tokens: TokenWithInfo[];
  onTokenClick: (tokenAddress: string) => void;
}
