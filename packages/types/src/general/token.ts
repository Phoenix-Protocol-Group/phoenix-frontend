export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
  contractId: string; // Contract address/ID for the token
  id?: string; // Alias for contractId for backward compatibility
  symbol?: string; // Token symbol
  decimals?: number; // Token decimals
  balance?: bigint; // Raw balance from contract
  isStakingToken?: boolean; // Whether this is a staking token
}
