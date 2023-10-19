type Operation = {
  ask_asset: string;
  offer_asset: string;
};

type Pool = {
  asset_a: string;
  asset_b: string;
};
export function findBestPath(
  fromAsset: string,
  toAsset: string
): { operations: Operation[] } {
  const pools: Pool[] = [
    {
      asset_a: "CA5F2XGO4TFHBIJIZ3A7XISPI4DUQGBS77PRUM3Q7SFPBLLVPDCAUTWB",
      asset_b: "CCF34UHY3YWEXTXJMSCYAPDEX4WMIFC3DT2PR2X7PWSUXLE2XXQSVU37",
    },
    {
      asset_a: "CA5F2XGO4TFHBIJIZ3A7XISPI4DUQGBS77PRUM3Q7SFPBLLVPDCAUTWB",
      asset_b: "CDVEBAUCIQDJREA4JNU42JDZC3SJPJDY654GWSGATNXMRWEFCCC6SUA4",
    },
    {
      asset_a: "CA5F2XGO4TFHBIJIZ3A7XISPI4DUQGBS77PRUM3Q7SFPBLLVPDCAUTWB",
      asset_b: "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT",
    },
  ];

  const operations: Operation[] = [];
  // Helper function to avoid duplicate operations
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
