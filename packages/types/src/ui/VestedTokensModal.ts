import { Token } from "../general";

export interface VestedTokensModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  vestingInfo: any[]
  onButtonClick?: (index: number) => void;
}
