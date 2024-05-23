import { Transaction } from "@stellar/stellar-sdk";

export const sign = async ({
  challengeTransaction,
  networkPassphrase,
}: {
  challengeTransaction: Transaction;
  networkPassphrase: string;
}): Promise<string> => {
  // Serialize the transaction to a string
  const transactionXDR = challengeTransaction.toXDR();

  // Define the API endpoint URL
  const apiURL = "/api/transaction";

  // Create the request body
  const body = JSON.stringify({
    transaction: transactionXDR,
  });

  // Make the POST request to the API
  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  // Handle the response
  if (!response.ok) {
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    );
  }

  const responseData = await response.json();
  return responseData.signedTransaction;
};
