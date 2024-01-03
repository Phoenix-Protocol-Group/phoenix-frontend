import { Token } from "../general";

export interface TokenBoxProps {
  token: Token;
  onAssetClick?: () => void;
  onChange: (value: string) => void;
  hideDropdownButton?: boolean;
  value: string | undefined;
  disabled?: boolean;
  loadingValues?: boolean;
}
