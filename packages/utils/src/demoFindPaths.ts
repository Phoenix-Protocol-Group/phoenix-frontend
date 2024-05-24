// Description: This file contains the implementation of the findBestPath function.
type Operation = {
  ask_asset: string;
  offer_asset: string;
};

type Pool = {
  asset_a: string;
  asset_b: string;
};

/**
 * Find the best path between two assets
 * @param {string} fromAsset
 * @param {string} toAsset
 * @param {Pool[]} pools
 * @returns {Operation[]}
 * @example
 * const pools = [
 *  { asset_a: "USD", asset_b: "BTC" },
 *  { asset_a: "BTC", asset_b: "ETH" },
 *  { asset_a: "ETH", asset_b: "USD" },
 *  { asset_a: "USD", asset_b: "ETH" },
 *  { asset_a: "ETH", asset_b: "BTC" },
 *  { asset_a: "BTC", asset_b: "USD" },
 *  { asset_a: "BTC", asset_b: "XLM" },
 *  { asset_a: "XLM", asset_b: "USD" },
 * ];
 * findBestPath("USD", "XLM", pools);
 * // Returns [{ ask_asset: "USD", offer_asset: "BTC" }, { ask_asset: "BTC", offer_asset: "XLM" }]
 * @module utils
 * @function findBestPath
 */
export function findBestPath(
  fromAsset: string,
  toAsset: string,
  pools: Pool[]
): { operations: Operation[] } {
  const operations: Operation[] = [];

  /**
   * Add an operation to the list of operations
   * @param {string} ask
   * @param {string} offer
   * @returns {void}
   * @memberof findBestPath
   * @instance addOperation
   */
  const addOperation = (ask: string, offer: string) => {
    if (
      !operations.some((op) => op.ask_asset === ask && op.offer_asset === offer)
    ) {
      operations.push({
        ask_asset: ask,
        offer_asset: offer,
      });
    }
  };

  // Check direct route
  for (const pool of pools) {
    if (
      (pool.asset_a === fromAsset && pool.asset_b === toAsset) ||
      (pool.asset_b === fromAsset && pool.asset_a === toAsset)
    ) {
      addOperation(fromAsset, toAsset);
      return { operations };
    }
  }

  // Check indirect routes
  for (const pool1 of pools) {
    for (const pool2 of pools) {
      if (pool1 !== pool2) {
        const commonAsset =
          pool1.asset_a === pool2.asset_a || pool1.asset_a === pool2.asset_b
            ? pool1.asset_a
            : pool1.asset_b;

        if (
          (pool1.asset_a === fromAsset || pool1.asset_b === fromAsset) &&
          (pool2.asset_a === toAsset || pool2.asset_b === toAsset) &&
          commonAsset !== fromAsset &&
          commonAsset !== toAsset
        ) {
          addOperation(fromAsset, commonAsset);
          addOperation(commonAsset, toAsset);
          return { operations };
        }
      }
    }
  }

  return { operations };
}
