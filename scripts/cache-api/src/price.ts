import { CoinGeckoClient } from 'coingecko-api-v3';

export interface Pair {
  id: number;
  ratio: number;
  tokenA: string;
  tokenB: string;
}

interface PathNode {
  id: number;
  token: string;
}

export function findBestPath(tokenSymbol: string, pairsArray: Pair[], targets: string[]): PathNode[] {
  const graph: { [key: string]: { [key: string]: number } } = {};
  const pairIdMap: { [key: string]: number } = {};
  pairsArray.forEach((item) => {
    const tokenA = item.tokenA;
    const tokenB = item.tokenB;
    if (!graph[tokenA]) graph[tokenA] = {};
    if (!graph[tokenB]) graph[tokenB] = {};
    graph[tokenA][tokenB] = item.id;
    graph[tokenB][tokenA] = item.id;
    pairIdMap[`${tokenA}-${tokenB}`] = item.id;
    pairIdMap[`${tokenB}-${tokenA}`] = item.id;
  });

  const visited: Set<string> = new Set();
  const queue: { node: string; path: PathNode[] }[] = [{ node: tokenSymbol, path: [] }];
  const paths: PathNode[] = [];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (targets.includes(node)) {
      const pairId = pairIdMap[`${tokenSymbol}-${node}`];
      if (pairId !== undefined) {
        paths.push({ id: pairId, token: node });
      }
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor in graph[node]) {
        queue.push({ node: neighbor, path: [...path, { id: graph[node][neighbor], token: neighbor }] });
      }
    }
  }
  return paths;
}

const coinGecko = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export async function getPrice(ids: string, currency?: string) {
  const prices = await coinGecko.simplePrice({
    ids: ids,
    vs_currencies: currency || "usd",
  });
  
  return prices;
}
