import { findBestPath } from "../demoFindPaths";

describe("findBestPath", () => {
  it("should return a direct route if available", () => {
    const fromAsset =
      "CCF34UHY3YWEXTXJMSCYAPDEX4WMIFC3DT2PR2X7PWSUXLE2XXQSVU37";
    const toAsset = "CA5F2XGO4TFHBIJIZ3A7XISPI4DUQGBS77PRUM3Q7SFPBLLVPDCAUTWB";

    const result = findBestPath(fromAsset, toAsset);

    expect(result.operations).toEqual([
      {
        ask_asset: fromAsset,
        offer_asset: toAsset,
      },
    ]);
  });

  it("should return an empty array if no route is available", () => {
    const fromAsset = "not_exist_1";
    const toAsset = "not_exist_2";

    const result = findBestPath(fromAsset, toAsset);

    expect(result.operations).toEqual([]);
  });
});
