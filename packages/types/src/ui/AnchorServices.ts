import { Token } from "../general";

type anchorSEP = "sep24" | "sep6"; // Only SEP 24 supported for now

export interface Anchor {
  name: string;
  logo: string;
  sep: anchorSEP[];
  tokens: Token[];
  domain: string;
}

export interface AnchorServicesProps {
  anchors: Anchor[];
  open: boolean;
  authenticate: (anchor: Anchor) => Promise<boolean>;
  sign: (anchor: Anchor) => Promise<boolean>;
  send: (anchor: Anchor) => Promise<boolean>;
  setOpen: (open: boolean) => void;
}
