import * as SorobanClient from "soroban-client";
import { constants } from "@phoenix-protocol/utils";

/**
 * SorobanClient.Server instance, initialized using {@link RPC_URL} used to
 * initialize this library.
 */
export const Server = new SorobanClient.Server(constants.RPC_URL, {
  allowHttp: constants.RPC_URL.startsWith("http://"),
});
