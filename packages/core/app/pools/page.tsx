"use client";

import { Pool, Pools, Token } from "@phoenix-protocol/ui";

const testTokens: Token[] = [
  {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  },
  {
    name: "USDC",
    icon: "cryptoIcons/usdc.svg",
    amount: 50,
    category: "Stable",
    usdValue: 1 * 50,
  },
];

const testPool: Pool = {
  tokens: testTokens,
  tvl: "$29,573.57",
  maxApr: "98.65%",
  userLiquidity: 30,
};

const pools: Pool[] = [
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
];

export default function Page() {
  return (
    <Pools
      pools={pools}
      filter="ALL"
      sort="HighAPR"
      onAddLiquidityClick={() => {}}
      onShowDetailsClick={() => {}}
      onFilterClick={() => {}}
      onSortSelect={() => {}}
    />
  );
}
