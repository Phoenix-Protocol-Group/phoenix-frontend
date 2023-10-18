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

export function findBestPath(tokenSymbol: string, pairsArray: Pair[], targets: string[]): { ratio: number, path: Pair[] } {
  const graph: { [key: string]: { [key: string]: Pair } } = {};
  pairsArray.forEach((item) => {
    const tokenA = item.tokenA;
    const tokenB = item.tokenB;
    if (!graph[tokenA]) graph[tokenA] = {};
    if (!graph[tokenB]) graph[tokenB] = {};
    graph[tokenA][tokenB] = item;
    graph[tokenB][tokenA] = item;
  });

  const visited: Set<string> = new Set();
  const queue: { node: string; path: Pair[], ratio: number }[] = [{ node: tokenSymbol, path: [], ratio: 1 }];
  let finalRatio = 1;

  while (queue.length > 0) {
    const { node, path, ratio } = queue.shift()!;
    if (targets.includes(node)) {
      finalRatio = ratio;
      return { ratio: finalRatio, path };
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor in graph[node]) {
        let nextRatio = ratio;
        if (graph[node][neighbor].tokenB === node) {
          nextRatio *= graph[node][neighbor].ratio;
        } else {
          nextRatio *= 1 / graph[node][neighbor].ratio;
        }
        queue.push({ node: neighbor, path: [...path, graph[node][neighbor]], ratio: nextRatio });
      }
    }
  }
  return { ratio: finalRatio, path: [] };
}

export function calculateTokenValue(tokenSymbol: string, targetTokens: string[], pairsArray: Pair[], targetArray: string[]): number {
  let value = 0;
  let found = false;
  for (const targetToken of targetTokens) {
    const { ratio, path } = findBestPath(tokenSymbol, pairsArray, targetArray);
    if (path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].tokenA === tokenSymbol && path[i].tokenB === targetToken) {
          if (path[i].ratio > 0) {
            value = 1 * path[i].ratio;
          } else {
            value = 1 / -path[i].ratio;
          }
          found = true;
          break;
        } else if (path[i].tokenB === tokenSymbol && path[i].tokenA === targetToken) {
          if (path[i].ratio > 0) {
            value = 1 / path[i].ratio;
          } else {
            value = 1 * -path[i].ratio;
          }
          found = true;
          break;
        }
      }
    }
    if (found) {
      break;
    }
  }
  return value;
}

const coinGecko = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export async function getPrices(ids: string, currency?: string) {
  const prices = await coinGecko.simplePrice({
    ids: ids,
    vs_currencies: currency || "usd",
  });
  
  return prices;
}
