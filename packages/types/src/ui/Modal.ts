import { Token } from "../general";

export interface ModalProps {
  type: ModalType;
  title: string;
  description?: string;
  tokens?: Token[];
  tokenAmounts?: number[];
  tokenTitles?: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onButtonClick?: () => void;
  error?: string;
}

export type ModalType = "SUCCESS" | "WARNING" | "ERROR" | "LOADING";
