import { Token } from "../general";

export type Chain = {
  name: string;
  icon: string;
  tokens: Token[];
};

export interface AssetSelectorProps {
  tokens: Token[];
  tokensAll: Token[];
  hideQuickSelect?: boolean;
  onClose: () => void;
  onTokenClick: (token: Token) => void;
}

export interface BridgeAssetSelectorProps {
  chains: Chain[];
  onClose: () => void;
  onTokenClick: (token: Token) => void;
}
