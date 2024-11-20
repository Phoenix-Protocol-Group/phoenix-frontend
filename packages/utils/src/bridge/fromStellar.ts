import {
  AllbridgeCoreSdk,
  AmountFormat,
  ChainSymbol,
  FeePaymentMethod,
  Messenger,
  nodeRpcUrlsDefault,
  SendParams,
} from "@allbridge/bridge-core-sdk";
import * as constants from "../constants";
import { Horizon, Networks, TransactionBuilder } from "@stellar/stellar-sdk";

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
export const getBridgeTransactionFromStellar = async (
  toChain: ChainSymbol,
  fromAddress: string,
  toAddress: string,
  amount: string,
  tokenSymbol: string,
  memo?: string
) => {
  try {
    // Initialize Stellar SDK
    const server = new Horizon.Server("https://horizon.stellar.org");
    //@ts-ignore
    const account = await server.loadAccount(sourceKeypair);

    // Initialize Allbridge SDK
    const sdk = new AllbridgeCoreSdk({
      ...nodeRpcUrlsDefault,
      SRB: constants.RPC_URL,
    });
    const chains = await sdk.chainDetailsMap();

    const sourceToken = chains[ChainSymbol.SRB].tokens.find(
      (t) => t.symbol === tokenSymbol
    );
    const destinationToken = chains[toChain].tokens.find(
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
      extraGas: "0.65",
      extraGasFormat: AmountFormat.FLOAT,
      gasFeePaymentMethod: FeePaymentMethod.WITH_STABLECOIN,
    };

    const xdrTx = (await sdk.bridge.rawTxBuilder.send(sendParams)) as string;

    return TransactionBuilder.fromXDR(xdrTx, Networks.PUBLIC);
  } catch (e) {
    console.error(e);
  }
};
