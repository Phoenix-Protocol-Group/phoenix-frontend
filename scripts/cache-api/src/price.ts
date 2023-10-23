import { CoinGeckoClient } from 'coingecko-api-v3';

export interface Pair {
  id: number;
  ratio: number;
  tokenA: string;
  tokenB: string;
}

type Target = {
  [key: string]: {
    [key: string]: number;
  };
};

export function findBestPath(tokenSymbol: string, pairsArray: Pair[], targets: string[]): Pair[] {
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
  const queue: { node: string; path: Pair[] }[] = [{ node: tokenSymbol, path: [] }];
  const finalPath: Pair[] = [];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (targets.includes(node)) {
      finalPath.push(...path);
      return finalPath;
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor in graph[node]) {
        const pair = graph[node][neighbor];
        const nextPath = [...path, { ...pair, ratio: pair.tokenB === node ? pair.ratio : 1 / pair.ratio }];
        queue.push({ node: neighbor, path: nextPath });
      }
    }
  }
  return finalPath;
}

export function calculateTokenValue(baseToken: string, pairsArray: Pair[], targets: Target[]): number | undefined {
  for (const target of targets) {
    const targetToken = Object.keys(target)[0];
    const targetPrice = target[targetToken].usd;

    if (targetToken === baseToken) {
      return target[targetToken].usd;
    }

    const path = findBestPath(baseToken, pairsArray, [targetToken]);

    if (path.length > 0) {
      let value = 1;
      for (let i = 0; i < path.length; i++) {
        const currentPair = path[i];
        if (currentPair.tokenA === baseToken) {
          value *= currentPair.ratio;
        } else {
          value /= currentPair.ratio;
        }
      }
      value *= targetPrice;
      return value;
    }
  }
  return undefined;
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
