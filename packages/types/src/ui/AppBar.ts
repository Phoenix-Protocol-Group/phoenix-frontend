export interface AppBarProps {
  balance?: number | undefined;
  walletAddress?: string | undefined;
  mobileNavOpen: boolean;
  sidebarOpen?: boolean; // Add sidebar state for desktop positioning
  scrollDirection?: "up" | "down" | null; // Add scroll direction for mobile UX
  isAtTop?: boolean; // Add scroll position for styling
  connectWallet: () => void;
  disconnectWallet: () => void;
  toggleMobileNav: (open: boolean) => void;
}
