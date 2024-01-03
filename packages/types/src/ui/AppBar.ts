export interface AppBarProps {
  balance?: number | undefined;
  walletAddress?: string | undefined;
  mobileNavOpen: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  toggleMobileNav: (open: boolean) => void;
}
