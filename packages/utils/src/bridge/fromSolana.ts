import {
  AllbridgeCoreSdk,
  ChainSymbol,
  FeePaymentMethod,
  Messenger,
  NodeRpcUrls,
  SendParams,
} from "@allbridge/bridge-core-sdk";

import { VersionedTransaction } from "@solana/web3.js";

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
export const getBridgeTransactionFromSolana = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  tokenSymbol: string
) => {
  try {
    // Initialize Allbridge SDK
    const SDK_NODE_URLS: NodeRpcUrls = {
      [ChainSymbol.SOL]: "https://rpc.ankr.com/solana",
    };
    const sdk = new AllbridgeCoreSdk(SDK_NODE_URLS);
    const chains = await sdk.chainDetailsMap();

    const sourceToken = chains[ChainSymbol.SOL].tokens.find(
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
    )) as VersionedTransaction;
  } catch (e) {
    console.error(e);
  }
};
