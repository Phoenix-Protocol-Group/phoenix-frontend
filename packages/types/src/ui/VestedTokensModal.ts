import { Token } from "../general";

export interface VestedTokensModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  graphData: any[];
  claimableAmount: number;
  onButtonClick?: () => void;
}
