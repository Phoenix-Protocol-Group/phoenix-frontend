import React, { useCallback } from "react";
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
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { useRestoreModal } from "@/providers/RestoreModalProvider";
import { AppStore, AppStorePersist } from "@phoenix-protocol/types";

// Define Contract Types
type ContractType =
  | "pair"
  | "multihop"
  | "stake"
  | "factory"
  | "vesting"
  | "token";

// Add options interface with onSuccess callback
interface TransactionOptions {
  onSuccess?: () => void;
}

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
  options?: TransactionOptions;
}

interface ExecuteContractTransactionParams<T extends ContractType>
  extends BaseExecuteContractTransactionParams<T> {
  contractType: T;
}

const getSigner = (storePersist: AppStorePersist, appStore: AppStore) => {
  return storePersist.wallet.walletType === "wallet-connect"
    ? appStore.walletConnectInstance
    : new Signer();
};

const getSignerFunction = (signer: any, storePersist: any) => {
  return (tx: string) =>
    storePersist.wallet.walletType === "wallet-connect"
      ? signer.signTransaction(tx)
      : signer.sign(tx);
};

const getContractClient = <T extends ContractType>(
  contractType: T,
  contractAddress: string,
  signer: any,
  networkPassphrase: string,
  rpcUrl: string,
  publicKey: string,
  storePersist: any
): ContractClientType<T> => {
  console.log(1);
  const signTransaction = getSignerFunction(signer, storePersist);
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
  const appStore = useAppStore();

  const { openRestoreModal, closeRestoreModal } = useRestoreModal();

  const executeContractTransaction = useCallback(
    async <T extends ContractType>({
      contractType,
      contractAddress,
      transactionFunction,
      options = {},
    }: ExecuteContractTransactionParams<T>) => {
      const signer = getSigner(storePersist, appStore);
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
            publicKey,
            storePersist
          );

          const transaction = await transactionFunction(
            contractClient,
            restore
          );

          console.log("Attempting to sign and send transaction...");

          // Step 2: Handle signing and sending with the new addAsyncToast
          return addAsyncToast(
            new Promise(async (resolve, reject) => {
              try {
                if (restore) {
                  console.log("Restoring transaction state...");
                  await transaction.simulate({ restore: true });
                  options.onSuccess?.(); // Call onSuccess callback after successful restore
                  resolve({});
                } else {
                  const sentTransaction = await transaction.signAndSend();
                  options.onSuccess?.(); // Call onSuccess callback after successful transaction
                  resolve({
                    transactionId:
                      sentTransaction.sendTransactionResponse?.hash,
                  });
                }
              } catch (error) {
                console.error("Error during signing and sending:", error);

                // Check if restore is required
                if (
                  error instanceof Error &&
                  error.message.includes("restore some contract state")
                ) {
                  openRestoreModal(async () => {
                    try {
                      await executeTransaction(true); // Retry with restore
                      resolve({});
                    } catch (restoreError) {
                      console.error(
                        "Error during restoring transaction:",
                        restoreError
                      );
                      reject(restoreError);
                    } finally {
                      closeRestoreModal();
                    }
                  });
                  return; // Exit early since restore will handle the resolution
                }
                reject(error);
              }
            }),
            loadingMessage,
            { title: "Transaction" }
          );
        } catch (error) {
          console.log("Unexpected error executing contract transaction", error);
          return addAsyncToast(Promise.reject(error), loadingMessage, {
            title: "Transaction",
          });
        }
      };

      // Start transaction execution
      return executeTransaction();
    },
    [addAsyncToast, storePersist, openRestoreModal, closeRestoreModal]
  );

  return {
    executeContractTransaction,
  };
};
