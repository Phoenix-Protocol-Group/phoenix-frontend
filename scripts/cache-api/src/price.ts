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

export function calculateTokenValue(baseToken: string, pairsArray: Pair[], targets: Target[]): number | undefined {
  for (const target of targets) {
    const targetToken = Object.keys(target)[0];
    const targetPrice = target[targetToken].usd;

    if (targetToken === baseToken) {
      return target[targetToken].usd;
    }

    const { ratio, path } = findBestPath(baseToken, pairsArray, [targetToken]);

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
