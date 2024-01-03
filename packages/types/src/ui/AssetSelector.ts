import { Token } from "../general";

export interface AssetSelectorProps {
  tokens: Token[];
  tokensAll: Token[];

  onClose: () => void;
  onTokenClick: (token: Token) => void;
}
