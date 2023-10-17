import { CoinGeckoClient } from 'coingecko-api-v3';

type Pair = [string, string];

interface Graph {
  [key: string]: string[];
}

function findBestPath(pairArray: Pair[], stringArray: string[]): string[] | null {
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

  const queue: { node: string; path: string[] }[] = pairArray.map(([a, b]) => ({
    node: a,
    path: [a],
  }));

  const visited: { [key: string]: boolean } = {};

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (stringArray.includes(node)) {
      return path;
    }
    if (!graph[node] || visited[node]) {
      continue;
    }
    visited[node] = true;
    for (const neighbor of graph[node]) {
      queue.push({ node: neighbor, path: [...path, neighbor] });
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
