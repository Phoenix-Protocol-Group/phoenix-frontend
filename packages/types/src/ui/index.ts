export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

export interface Pool {
  tokens: Token[];
  tvl: string;
  maxApr: string;
  userLiquidity: number;
  poolAddress: string;
}
