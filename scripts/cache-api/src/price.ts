import { CoinGeckoClient } from 'coingecko-api-v3';

type Pair = [string, string];

interface Graph {
  [key: string]: string[];
}

function findBestPath(
  pair: Pair,
  pairArray: Pair[],
  stringArray: string[]
): string[] | null {
  const graph: Graph = {};

  for (const p of pairArray) {
    const [address1, address2] = p;
    if (!graph[address1]) {
      graph[address1] = [];
    }
    if (!graph[address2]) {
      graph[address2] = [];
    }
    graph[address1].push(address2);
    graph[address2].push(address1);
  }

  const visited: { [key: string]: boolean } = {};
  const path: string[] = [];

  const dfs = (node: string, target: string, path: string[]): string[] | null => {
    if (node === target) {
      return path;
    }
    if (!graph[node] || visited[node]) {
      return null;
    }
    visited[node] = true;
    for (const neighbor of graph[node]) {
      const result = dfs(neighbor, target, [...path, neighbor]);
      if (result) {
        return result;
      }
    }
    return null;
  };

  const [source, target] = pair;
  const result = dfs(source, target, [source]);
  return result;
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
