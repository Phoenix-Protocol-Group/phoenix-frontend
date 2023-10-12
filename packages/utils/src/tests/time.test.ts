import { timestampToLocalDateString, daysSinceTimestamp } from "../time";

describe("timestampToLocalDateString", () => {
  it("should convert timestamp to local date string", () => {
    const dateSpy = jest
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("01/01/2022");

    const result = timestampToLocalDateString(1640995200000);
    expect(result).toBe("01/01/2022");
    dateSpy.mockRestore();
  });
});

describe("daysSinceTimestamp", () => {
  it("should return the number of full days since the given timestamp", () => {
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1641081600000);

    const result = daysSinceTimestamp(1640995200);
    expect(result).toBe(1);
    nowSpy.mockRestore();
  });

  it("should return 0 if the timestamp is from the same day", () => {
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1640995300000);

    const result = daysSinceTimestamp(1640995200);
    expect(result).toBe(0);
    nowSpy.mockRestore();
  });
});
