export interface Token {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenHistory {
  id: number;
  createdAt: number;
  price: number;
  tokenId: number;
}

export interface Pair {
  id: number;
  address: string;
  assetAId: number;
  assetBId: number;
  assetShareId: number;
}

export interface PairHistory {
  id: number;
  createdAt: number;
  pairId: number;
  assetAAmount: number;
  assetBAmount: number;
  assetShareAmount: number;
}
