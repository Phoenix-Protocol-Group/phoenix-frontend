import { Account } from "soroban-client";

export type Token = {
  id: string;
  balance: number;
};

export interface WalletActions {
  connectWallet: (walletAddress: string) => void;
  account: undefined | Account;
  tokens: Token[];
  fetchTokenBalance: (tokenId: string) => void;
}
