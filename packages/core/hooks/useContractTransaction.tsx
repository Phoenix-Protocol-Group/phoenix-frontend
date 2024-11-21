import React, { useCallback, useState, useEffect } from "react";
import {
  PhoenixPairContract,
  PhoenixMultihopContract,
  PhoenixStakeContract,
  PhoenixFactoryContract,
  PhoenixVestingContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import {
  AssembledTransaction,
  SentTransaction,
} from "@stellar/stellar-sdk/lib/contract";
import { useToast } from "@/hooks/useToast";
import { constants, Signer } from "@phoenix-protocol/utils";
import { usePersistStore } from "@phoenix-protocol/state";
import { useRestoreModal } from "@/providers/RestoreModalProvider";

// Define Contract Types
type ContractType =
  | "pair"
  | "multihop"
  | "stake"
  | "factory"
  | "vesting"
  | "token";

const contractClients = {
  pair: PhoenixPairContract.Client,
  multihop: PhoenixMultihopContract.Client,
  stake: PhoenixStakeContract.Client,
  factory: PhoenixFactoryContract.Client,
  vesting: PhoenixVestingContract.Client,
  token: SorobanTokenContract.Client,
};

type ContractClientType<T extends ContractType> = T extends "pair"
  ? PhoenixPairContract.Client
  : T extends "multihop"
  ? PhoenixMultihopContract.Client
  : T extends "stake"
  ? PhoenixStakeContract.Client
  : T extends "factory"
  ? PhoenixFactoryContract.Client
  : T extends "vesting"
  ? PhoenixVestingContract.Client
  : T extends "token"
  ? SorobanTokenContract.Client
  : never;

interface BaseExecuteContractTransactionParams<T extends ContractType> {
  contractAddress: string;
  transactionFunction: (
    client: ContractClientType<T>,
    restore?: boolean
  ) => Promise<AssembledTransaction<any>>;
}

interface ExecuteContractTransactionParams<T extends ContractType>
  extends BaseExecuteContractTransactionParams<T> {
  contractType: T;
}

const getSigner = (storePersist: any) => {
  return storePersist.wallet.walletType === "wallet-connect"
    ? storePersist.walletConnectInstance
    : new Signer();
};

const getSignerFunction = (signer: any) => {
  return (tx: string) =>
    signer.walletType === "wallet-connect"
      ? signer.signTransaction(tx)
      : signer.sign(tx);
};

const getContractClient = <T extends ContractType>(
  contractType: T,
  contractAddress: string,
  signer: any,
  networkPassphrase: string,
  rpcUrl: string,
  publicKey: string
): ContractClientType<T> => {
  const signTransaction = getSignerFunction(signer);
  const commonOptions = {
    publicKey: publicKey,
    contractId: contractAddress,
    networkPassphrase,
    rpcUrl,
    signTransaction: signTransaction.bind(signer),
  };

  const ClientConstructor = contractClients[contractType] as any;
  return new ClientConstructor(commonOptions);
};

export const useContractTransaction = () => {
  const { addAsyncToast } = useToast();
  const storePersist = usePersistStore();
  const { openRestoreModal, closeRestoreModal, restoreTransactionFunction } =
    useRestoreModal();

  const executeContractTransaction = useCallback(
    async <T extends ContractType>({
      contractType,
      contractAddress,
      transactionFunction,
    }: ExecuteContractTransactionParams<T>) => {
      const signer = getSigner(storePersist);
      const networkPassphrase = constants.NETWORK_PASSPHRASE;
      const rpcUrl = constants.RPC_URL;
      const loadingMessage = "Transaction in progress...";
      const publicKey = storePersist.wallet.address!;

      const executeTransaction = async (restore: boolean = false) => {
        try {
          // Step 1: Create the contract client and call the transaction function
          const contractClient = getContractClient(
            contractType,
            contractAddress,
            signer,
            networkPassphrase,
            rpcUrl,
            publicKey
          );

          // Pass the `restore` flag internally to `transactionFunction`
          const transaction = await transactionFunction(
            contractClient,
            restore
          );

          console.log("Attempting to sign and send transaction...");

          // Step 2: Wrap the signAndSend in try-catch to properly catch any errors
          let sentTransaction: SentTransaction<any> | undefined;
          try {
            if (restore) {
              console.log("Restoring transaction state...");
              await transaction.simulate({ restore: true });
            } else {
              sentTransaction = await transaction.signAndSend();
            }
          } catch (error) {
            // Log the error and handle it here
            console.error(
              "Error during signing and sending transaction:",
              error
            );

            // Ensure the error contains the information needed
            if (error instanceof Error) {
              console.log("Error message:", error.message);
              if (error.message.includes("restore some contract state")) {
                // Open the modal and save the restore transaction function
                openRestoreModal(async () => {
                  try {
                    await executeTransaction(true); // Retry with restore set to true, which will call simulate with restore
                  } catch (restoreError) {
                    console.error(
                      "Error during restoring transaction:",
                      restoreError
                    );
                    addAsyncToast(Promise.reject(restoreError), loadingMessage);
                  } finally {
                    closeRestoreModal();
                  }
                });
                return; // Don't proceed until the user decides to restore
              }
            }
            // Re-throw the error to be handled by addAsyncToast
            throw error;
          }

          // Step 3: If successful, add the promise for the toast
          const promise: Promise<{ transactionId?: string }> = Promise.resolve({
            transactionId: sentTransaction
              ? sentTransaction.sendTransactionResponse?.hash
              : undefined,
          });

          addAsyncToast(promise, loadingMessage);
        } catch (error) {
          // Handle unexpected errors that occur outside of `signAndSend()`
          console.log("Unexpected error executing contract transaction", error);
          addAsyncToast(Promise.reject(error), loadingMessage);
        }
      };

      // Execute transaction initially without restore
      await executeTransaction();
    },
    [addAsyncToast, storePersist, openRestoreModal, closeRestoreModal]
  );

  return {
    executeContractTransaction,
  };
};
