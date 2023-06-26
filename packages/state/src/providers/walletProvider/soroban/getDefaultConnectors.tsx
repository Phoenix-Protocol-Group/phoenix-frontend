import { Connector } from "../types";
import { freighter } from "../../../state/wallet/freighter";

export const getDefaultConnectors = (): Connector[] => {
  const list: Connector[] = [freighter()];

  return list;
};
