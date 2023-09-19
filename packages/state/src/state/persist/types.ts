import {Server} from 'soroban-client';
import {Token, WalletChain} from '../wallet/types';
import { Connector } from '../wallet/types';

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Server | undefined;
  connector: Connector | undefined;
};

export interface PersistWalletActions {
  connectWallet: (connector: Connector) => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
}
