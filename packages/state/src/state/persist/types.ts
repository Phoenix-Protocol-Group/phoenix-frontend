import {Server} from 'soroban-client';
import {Token, WalletChain} from '../wallet/types';

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Server | undefined;
};

export interface PersistWalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
}