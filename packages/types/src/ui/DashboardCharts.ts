export type DashboardData = number[];
export interface DashboardChartsProps {
  data: DashboardData[];
  assetName: string;
  icon: {
    large: string;
    small: string;
  };
}
