import {
  AllbridgeCoreSdk,
  ChainSymbol,
  FeePaymentMethod,
  Messenger,
  nodeRpcUrlsDefault,
  RawEvmTransaction,
  SendParams,
} from "@allbridge/bridge-core-sdk";

/**
 * Get bridge transaction from Stellar
 * @param toChain
 * @param fromAddress
 * @param toAddress
 * @param amount
 * @param tokenSymbol
 * @param memo
 *
 * @returns TransactionBuilder
 */
export const getBridgeTransactionFromEth = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  tokenSymbol: string
) => {
  try {
    // Initialize Allbridge SDK
    const sdk = new AllbridgeCoreSdk({
      ...nodeRpcUrlsDefault,
    });
    const chains = await sdk.chainDetailsMap();

    const sourceToken = chains[ChainSymbol.ETH].tokens.find(
      (t) => t.symbol === tokenSymbol
    );
    const destinationToken = chains[ChainSymbol.SRB].tokens.find(
      (t) => t.symbol === tokenSymbol
    );

    if (!sourceToken || !destinationToken) throw new Error("Token not found");

    const sendParams: SendParams = {
      amount,
      fromAccountAddress: fromAddress,
      toAccountAddress: toAddress,
      sourceToken,
      destinationToken,
      messenger: Messenger.ALLBRIDGE,
      gasFeePaymentMethod: FeePaymentMethod.WITH_STABLECOIN,
    };
    return (await sdk.bridge.rawTxBuilder.send(
      sendParams
    )) as RawEvmTransaction;
  } catch (e) {
    console.error(e);
  }
};
