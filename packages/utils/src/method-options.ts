import { Wallet } from "@phoenix-protocol/types";

// defined this way so typeahead shows full union, not named alias
let responseTypes: "simulated" | "full" | undefined;
export type ResponseTypes = typeof responseTypes;

export type XDR_BASE64 = string;

export type ClassOptions = {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
  errorTypes?: Record<number, { message: string }>;
  /**
   * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
   *
   * @example
   * ```ts
   * import freighter from "@stellar/freighter-api";
   * import { Contract } from "stake-bindings";
   * const contract = new Contract({
   *   …,
   *   wallet: freighter,
   * })
   * ```
   */
  wallet?: Wallet;
};

export type MethodOptions = {
  /**
   * The fee to pay for the transaction. Default: soroban-sdk's BASE_FEE ('100')
   */
  fee?: number;
};
