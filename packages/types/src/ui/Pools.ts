import { Token } from "../general";

export interface Pool {
  tokens: Token[];
  tvl: string;
  maxApr: string;
  userLiquidity: number;
  poolAddress: string;
}

export type PoolsSort = "HighTVL" | "HighAPR" | "LowTVL" | "LowAPR";
export type PoolsFilter = "ALL" | "MY";

export interface PoolsProps {
  pools: Pool[];
  onAddLiquidityClick: (pool: Pool) => void;
  onShowDetailsClick: (pool: Pool) => void;
  filter: PoolsFilter;
  sort: PoolsSort;
  onSortSelect: (by: PoolsSort) => void;
  onFilterClick: (by: PoolsFilter) => void;
}
