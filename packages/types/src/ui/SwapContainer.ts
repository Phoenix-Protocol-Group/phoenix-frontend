import { Token } from "../general";

export interface SwapContainerProps {
  fromToken: Token;
  toToken: Token;
  exchangeRate: string;
  networkFee: string;
  route: string;
  estSellPrice: string;
  minSellPrice: string;
  slippageTolerance: string;
  fromTokenValue?: string;
  toTokenValue?: string;
  swapButtonDisabled?: boolean;
  loadingSimulate?: boolean;
  onOptionsClick: () => void;
  onSwapTokensClick: () => void;
  onSwapButtonClick: () => void;
  onTokenSelectorClick: (isFromToken: boolean) => void;
  onInputChange: (isFromToken: boolean, value: string) => void;
  trustlineButtonActive?: boolean;
  trustlineAssetName: string;
  onTrustlineButtonClick: () => void;
  trustlineButtonDisabled?: boolean;
}
