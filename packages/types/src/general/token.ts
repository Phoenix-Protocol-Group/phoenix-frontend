export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

export interface TokenWithVestedAmount extends Token {
  amountVested: number;
  usdValueVested: number;
}
