import { getAccount } from "../account";
import { Server } from "../server";
import * as constants from "../constants";
import freighter from "@stellar/freighter-api";

jest.mock("@stellar/freighter-api", () => ({
  isConnected: jest.fn(),
  isAllowed: jest.fn(),
  getUserInfo: jest.fn(),
  signTransaction: jest.fn(),
}));
jest.mock("../server");
describe("getAccount", () => {
  it("returns null if not connected to Freighter", async () => {
    (
      freighter.isConnected as jest.MockedFunction<typeof freighter.isConnected>
    ).mockResolvedValue(false);
    const result = await getAccount();
    expect(result).toBeNull();
  });

  it("returns null if not allowed by Freighter", async () => {
    (
      freighter.isConnected as jest.MockedFunction<typeof freighter.isConnected>
    ).mockResolvedValue(true);
    (
      freighter.isAllowed as jest.MockedFunction<typeof freighter.isAllowed>
    ).mockResolvedValue(false);
    const result = await getAccount();
    expect(result).toBeNull();
  });

  it("returns null if public key is not available", async () => {
    (
      freighter.isConnected as jest.MockedFunction<typeof freighter.isConnected>
    ).mockResolvedValue(true);
    (
      freighter.isAllowed as jest.MockedFunction<typeof freighter.isAllowed>
    ).mockResolvedValue(true);
    (
      freighter.getUserInfo as jest.MockedFunction<typeof freighter.getUserInfo>
    ).mockResolvedValue({ publicKey: "someKey" });
    const result = await getAccount();
    expect(result).toBeNull();
  });
  it("returns Account if public key is available and server call succeeds", async () => {
    const mockAccount = constants.TESTING_SOURCE;

    (
      freighter.isConnected as jest.MockedFunction<typeof freighter.isConnected>
    ).mockResolvedValue(true);
    (
      freighter.isAllowed as jest.MockedFunction<typeof freighter.isAllowed>
    ).mockResolvedValue(true);
    (
      freighter.getUserInfo as jest.MockedFunction<typeof freighter.getUserInfo>
    ).mockResolvedValue({ publicKey: "someKey" });
    (
      Server.getAccount as jest.MockedFunction<typeof Server.getAccount>
    ).mockResolvedValue(mockAccount);

    const result = await getAccount();
    expect(result).toEqual(mockAccount);
  });

  it("returns null if server call fails", async () => {
    (
      freighter.isConnected as jest.MockedFunction<typeof freighter.isConnected>
    ).mockResolvedValue(true);
    (
      freighter.isAllowed as jest.MockedFunction<typeof freighter.isAllowed>
    ).mockResolvedValue(true);
    (
      freighter.getUserInfo as jest.MockedFunction<typeof freighter.getUserInfo>
    ).mockResolvedValue({ publicKey: "someKey" });
    (
      Server.getAccount as jest.MockedFunction<typeof Server.getAccount>
    ).mockRejectedValue(new Error());

    const result = await getAccount();
    expect(result).toBeNull();
  });
});
