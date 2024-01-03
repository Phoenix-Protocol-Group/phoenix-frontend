import { Token } from "../general";

export interface LiquidityMiningProps {
  // Rewards
  rewards: Token[];
  onClaimRewards: () => void;
  tokenName: string;
  // Stake LP Tokens
  balance: number;
  onStake: (amount: number) => void;
}

export interface LabTabProps {
  tokenA: Token;
  tokenB: Token;
  liquidityA: number;
  liquidityB: number;
  liquidityToken: Token;
  onAddLiquidity: (tokenAAmount: number, tokenBAmount: number) => void;
  onRemoveLiquidity: (liquidityTokenAmount: number) => void;
}

export interface PoolLiquidityProps {
  tokenA: Token;
  tokenB: Token;
  liquidityToken: Token;
  poolHistory: number[][];
  liquidityA: number;
  liquidityB: number;
  onAddLiquidity: (tokenAAmount: number, tokenBAmount: number) => void;
  onRemoveLiquidity: (liquidityTokenAmount: number) => void;
}
