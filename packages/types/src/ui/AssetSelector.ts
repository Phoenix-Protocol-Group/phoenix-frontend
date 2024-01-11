import { Token } from "../general";

export interface AssetSelectorProps {
  tokens: Token[];
  tokensAll: Token[];
  hideQuickSelect?: boolean;
  onClose: () => void;
  onTokenClick: (token: Token) => void;
}
