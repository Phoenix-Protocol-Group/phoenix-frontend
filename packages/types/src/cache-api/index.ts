export type Token = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type TokenHistory = {
  id: number;
  createdAt: number;
  price: number;
  tokenId: number;
};

export type Pair = {
  id: number;
  address: string;
  assetAId: number;
  assetBId: number;
  assetShareId: number;
};

export type PairHistory = {
  id: number;
  createdAt: number;
  pairId: number;
  assetAAmount: number;
  assetBAmount: number;
  assetShareAmount: number;
};
