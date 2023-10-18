import { CoinGeckoClient } from 'coingecko-api-v3';

interface Pair {
  id: number;
  ratio: number;
  tokenAAddress: string;
  tokenBAddress: string;
}

interface PathNode {
  id: number;
  token: string;
}

export function findBestPath(pair: Pair, pairsArray: Pair[], targets: string[]): PathNode[] | null {
  const graph: { [key: string]: { [key: string]: number } } = {};
  pairsArray.forEach((item) => {
    const tokenA = item.tokenAAddress;
    const tokenB = item.tokenBAddress;
    if (!graph[tokenA]) graph[tokenA] = {};
    if (!graph[tokenB]) graph[tokenB] = {};
    graph[tokenA][tokenB] = item.id;
    graph[tokenB][tokenA] = item.id;
  });

  const visited: Set<string> = new Set();
  const queue: { node: string; path: PathNode[] }[] = [{ node: pair.tokenAAddress, path: [] }];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (targets.includes(node)) {
      return path;
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor in graph[node]) {
        queue.push({ node: neighbor, path: [...path, { id: graph[node][neighbor], token: neighbor }] });
      }
    }
  }
  return null;
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
