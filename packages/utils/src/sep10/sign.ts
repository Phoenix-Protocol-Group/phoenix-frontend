import { Keypair, Transaction } from "stellar-sdk";
import { Wallet } from "../method-options";

export const sign = async ({
  challengeTransaction,
  networkPassphrase,
  wallet,
}: {
  challengeTransaction: Transaction;
  networkPassphrase: string;
  wallet: Wallet;
}) => {
  for (const op of challengeTransaction.operations) {
    if (op.type === "manageData" && op.name === "client_domain") {
      // The anchor server supports client attribution, get a signature from the demo wallet backend server

      const signedTx = await wallet.signTransaction(
        challengeTransaction.toEnvelope().toXDR("base64")
      );

      challengeTransaction = new Transaction(signedTx, networkPassphrase);

      break;
    }
  }

  const envelope = challengeTransaction.toEnvelope().toXDR("base64");
  const _transaction = new Transaction(envelope, networkPassphrase);
  const transaction = wallet.signTransaction(_transaction.toXDR());

  return transaction;
};
