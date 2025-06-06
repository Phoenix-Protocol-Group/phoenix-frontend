import { Connector } from "../state";

export interface OptionComponentProps {
  connector: Connector;
  onClick: () => void;
  selected: boolean;
  isMobile?: boolean;
}

export interface ConnectWalletProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  connectors: Connector[];
  connect: (connector: Connector) => Promise<void>;
}
