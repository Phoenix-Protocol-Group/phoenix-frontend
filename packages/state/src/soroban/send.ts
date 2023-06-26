import * as SorobanClient from "soroban-client";
import { Connector, WalletChain } from "../state";

export interface SendTransactionOptions {
  timeout?: number;
  skipAddingFootprint?: boolean;
  secretKey?: string;
}

export const sendTransaction = async (
  txn: SorobanClient.Transaction,
  options: SendTransactionOptions,
  activeConnector: Connector,
  activeChain: WalletChain,
  server: SorobanClient.Server
): Promise<SorobanClient.xdr.ScVal[]> => {
  // Check if there is a secret key or an active wallet
  if (!activeConnector) {
    throw new Error(
      "No secret key or active wallet. Provide at least one of those"
    );
  }

  // Check if there is a transaction, wallet, and chain
  if (!txn || !activeConnector || !activeChain) {
    throw new Error("No transaction or wallet or chain");
  }

  // Check if there is a connection to the server
  if (!server) throw new Error("Not connected to server");

  // Check if there is a timeout and if so, set it to 60 seconds
  const { timeout, skipAddingFootprint } = {
    timeout: 60000,
    skipAddingFootprint: false,
    ...options,
  };

  // Check if there is a network passphrase
  const networkPassphrase = activeChain.networkPassphrase;

  // Prepare the transaction
  const preparedtx = await server.prepareTransaction(txn, networkPassphrase);

  let signed = "";

  // User has not set a secretKey, txn will be signed using the Connector (wallet) provided in the sorobanContext
  signed = await activeConnector.signTransaction(preparedtx.toXDR(), {
    networkPassphrase,
  });

  const transactionToSubmit = SorobanClient.TransactionBuilder.fromXDR(
    signed,
    networkPassphrase
  );

  // Submit the transaction to the network
  const { hash, errorResultXdr } = await server.sendTransaction(
    transactionToSubmit
  );
  // If the result is an error, throw an error.
  if (errorResultXdr) {
    throw new Error(errorResultXdr);
  }
  const sleepTime = Math.min(1000, timeout);
  for (let i = 0; i <= timeout; i += sleepTime) {
    await sleep(sleepTime);
    try {
      console.debug("tx id:", hash);
      const response = await server.getTransaction(hash);
      console.debug(response);

      switch (response.status) {
        case "NOT_FOUND": {
          continue;
        }
        case "SUCCESS": {
          let resultXdr = response.resultXdr;
          if (!resultXdr) {
            // FIXME: Return a more sensible value for classic transactions.
            return [SorobanClient.xdr.ScVal.scvI32(-1)];
          }
          let results = SorobanClient.xdr.TransactionResult.fromXDR(
            resultXdr,
            "base64"
          )
            .result()
            .results();
          if (results.length > 1) {
            throw new Error(`Expected exactly one result, got ${results}.`);
          }

          let value = results[0].value();
          if (
            value?.switch() !==
            SorobanClient.xdr.OperationType.invokeHostFunction()
          ) {
            // FIXME: Return a more sensible value for classic transactions.
            return [SorobanClient.xdr.ScVal.scvI32(-1)];
          }

          return value.invokeHostFunctionResult().success();
        }
        case "FAILED": {
          let resultXdr = response.resultXdr;
          if (!resultXdr) {
            // FIXME: Return a more sensible value for classic transactions.
            return [SorobanClient.xdr.ScVal.scvI32(-1)];
          }
          let results = SorobanClient.xdr.TransactionResult.fromXDR(
            resultXdr,
            "base64"
          )
            .result()
            .results();
          if (results.length > 1) {
            throw new Error(`Expected exactly one result, got ${results}.`);
          }

          let value = results[0].value();
          if (
            value?.switch() !==
            SorobanClient.xdr.OperationType.invokeHostFunction()
          ) {
            // FIXME: Return a more sensible value for classic transactions.
            return [SorobanClient.xdr.ScVal.scvI32(-1)];
          }

          let result = value.invokeHostFunctionResult();
          switch (result.switch()) {
            case SorobanClient.xdr.InvokeHostFunctionResultCode.invokeHostFunctionMalformed(): {
              throw new Error("Transaction failed: malformed");
            }
            case SorobanClient.xdr.InvokeHostFunctionResultCode.invokeHostFunctionTrapped(): {
              throw new Error("Transaction failed: trapped");
            }
            default: {
              throw new Error(
                `Unexpected result code: ${result.switch().name}.`
              );
            }
          }
        }
        default: {
          throw new Error("Unexpected transaction status: " + response.status);
        }
      }
    } catch (err: any) {
      if ("code" in err && err.code === 404) {
        // No-op
      } else {
        throw err;
      }
    }
  }
  throw new Error("Timed out");
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
