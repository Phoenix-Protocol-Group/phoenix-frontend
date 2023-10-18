import { findBestPath } from "../demoFindPaths";

describe("findBestPath", () => {
  it("should return a direct route if available", () => {
    const fromAsset =
      "CCHEE2LEYD2QUESNKCUAQNXXQ3VYFL3XGI5CEZDHDT7NXKPEWQ6TFJVZ";
    const toAsset = "CDDDTR6DVLDFMCDHLXEJIDY6P4IADIM6HCM3QBHAR763YAWUJ6DZUV2P";

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
