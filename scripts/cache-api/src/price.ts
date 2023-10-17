import { CoinGeckoClient } from 'coingecko-api-v3';

type Pair = [string, string];

interface Graph {
  [key: string]: string[];
}

function findBestPath(
  pair: Pair,
  pairArray: Pair[],
  targetArray: string[]
): { [key: string]: { [key: string]: string[] } } {
  const result: { [key: string]: { [key: string]: string[] } } = {};

  const getPath = (start: string, targets: string[]): { [key: string]: string[] } => {
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

    const resultPaths: { [key: string]: string[] } = {};
    const visited: { [key: string]: boolean } = {};

    for (const target of targets) {
      const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];

      while (queue.length > 0) {
        const { node, path } = queue.shift()!;
        if (node === target) {
          resultPaths[target] = path;
          break;
        }
        if (!graph[node] || visited[node]) {
          continue;
        }
        visited[node] = true;
        for (const neighbor of graph[node]) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return resultPaths;
  };

  result[pair[0]] = getPath(pair[0], targetArray);
  result[pair[1]] = getPath(pair[1], targetArray);

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
