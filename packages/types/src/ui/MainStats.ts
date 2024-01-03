export interface TileProps {
  title: string;
  value: string;
  link: string;
  isMobile?: boolean;
}
export interface MainStatsProps {
  stats: TileProps[];
}
