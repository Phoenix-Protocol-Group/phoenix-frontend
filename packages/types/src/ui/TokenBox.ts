import { Token } from "../general";
import { Chain } from "./AssetSelector";

export interface TokenBoxProps {
  token: Token;
  onAssetClick?: () => void;
  onChange: (value: string) => void;
  hideDropdownButton?: boolean;
  value: string | undefined;
  disabled?: boolean;
  loadingValues?: boolean;
  chain?: Chain;
}
