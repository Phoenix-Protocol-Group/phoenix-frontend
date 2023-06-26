import { Server } from "soroban-client";
import { BigNumber } from "bignumber.js";
import { WalletChain } from "../../providers/walletProvider/types";

export type Token = {
  id: string;
  balance: BigNumber;
};

export type Wallet = {
  address: string;
  activeChain: WalletChain;
  server: Server;
};

export interface WalletActions {
  connectWallet: () => void;
  disconnectWallet: () => void;
  wallet: undefined | Wallet;
  tokens: Token[];
  fetchTokenBalance: (tokenId: string) => void;
}
