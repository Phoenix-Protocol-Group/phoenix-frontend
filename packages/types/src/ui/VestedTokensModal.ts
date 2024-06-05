import { Token } from "../general";

export interface VestedTokensModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  graphData: any;
  claimableAmount: any;
  token: Token | undefined;
  index: number;
  setIndex: (index: number) => void;
  onButtonClick?: () => void;
}
