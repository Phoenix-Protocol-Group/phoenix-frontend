export interface GainerOrLooserAsset {
  name: string;
  symbol: string;
  price: string;
  change: number;
  icon: string;
  volume: string;
}
export interface DashboardStatsProps {
  lockedAssets: string;
  availableAssets: string;
  loser: GainerOrLooserAsset;
  gainer: GainerOrLooserAsset;
}
