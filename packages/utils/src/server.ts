import { Horizon } from "stellar-sdk";
import { constants } from ".";

/**
 * SorobanClient.Server instance, initialized using {@link RPC_URL} used to
 * initialize this library.
 */
export const Server = new Horizon.Server(constants.RPC_URL, {
  allowHttp: constants.RPC_URL.startsWith("http://"),
});
