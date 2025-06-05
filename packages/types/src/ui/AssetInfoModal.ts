import { Pool } from "./Pools";

export interface AssetInfoModalProps {
  open: boolean;
  onClose: () => void;
  asset: AssetInfo;
  userBalance: number;
  loading: boolean;
  tradingVolume7d: {
    date?: {
      day?: number;
      month?: number;
      year: number;
    };
    time?: {
      hour: number;
      date?: {
        day: number;
        month: number;
        year: number;
      };
    };
    week?: {
      week: number;
      year: number;
    };
    month?: {
      month: number;
      year: number;
    };
    tokenAVolume: string;
    tokenBVolume: string;
    usdVolume: number;
  }[];
  pools: Pool[];
}

export interface AssetInfo {
  asset: string;
  supply: number;
  traded_amount: number;
  payments_amount: number;
  created: number;
  trustlines: number[];
  payments: number;
  domain: string;
  rating: {
    age: number;
    trades: number;
    payments: number;
    trustlines: number;
    volume7d: number;
    interop: number;
    liquidity: number;
    average: number;
  };
  price7d: [number, number][];
  volume7d: number;
  tomlInfo: {
    code: string;
    issuer: string;
    image: string;
    decimals: number;
    orgName: string;
    orgLogo: string;
  };
  paging_token: number;
}
