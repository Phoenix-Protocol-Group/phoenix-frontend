import { Connector } from "../types";
import { freighter } from "../freighter";

export const getDefaultConnectors = (): Connector[] => {
  const list: Connector[] = [freighter()];

  return list;
};
