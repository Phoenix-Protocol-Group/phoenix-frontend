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

/**
 * Options for executing a transaction.
 *
 * @property {() => void} [onSuccess] - A callback function that is invoked
 * after the transaction is successfully executed. This function should
 * handle any post-transaction logic, such as updating the UI or triggering
 * additional actions. It is optional and will not be called if not provided.
 *
 * @property {number} [fee] - Custom transaction fee in stroops. If not provided,
 * the default constants.PHOENIX_BASE_FEE (200 stroops) will be used.
 *
 * @example
 * // Using custom fee in transaction
 * executeContractTransaction({
 *   contractType: "pair",
 *   contractAddress: pairAddress,
 *   transactionFunction: (client, restore, txOptions) => client.swap(
 *     { sender: address, offer_asset: assetA, ask_asset: assetB, amount: amount.toString() },
 *     { ...txOptions }  // This passes the fee to the contract method
 *   ),
 *   options: {
 *     fee: 100000, // Custom fee in stroops (100,000 stroops = 0.01 XLM)
 *     onSuccess: () => refetchData()
 *   }
 * });
 *
 * // Using default PHOENIX_BASE_FEE
 * executeContractTransaction({
 *   contractType: "pair",
 *   contractAddress: pairAddress,
 *   transactionFunction: (client, restore, txOptions) => client.swap(
 *     { sender: address, offer_asset: assetA, ask_asset: assetB, amount: amount.toString() },
 *     { ...txOptions }  // This passes the default fee to the contract method
 *   ),
 *   options: {
 *     onSuccess: () => refetchData()
 *   }
 * });
 */
interface TransactionOptions {
  onSuccess?: () => void;
  fee?: number;
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
    restore?: boolean,
    txOptions?: { fee?: number }
  ) => Promise<AssembledTransaction<any>>;
  options?: TransactionOptions;
}

interface ExecuteContractTransactionParams<T extends ContractType>
  extends BaseExecuteContractTransactionParams<T> {
  contractType: T;
}

const getSigner = async () => {
  const signer = new Signer();
  await signer.getWallet();
  return signer;
};

const getSignerFunction = (signer: any, storePersist: any) => {
  return (tx: string) => signer.sign(tx);
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
  console.log(`Creating contract client for ${contractType} contract`);
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
      const signer = await getSigner();
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
          ); // Get transaction options with fee, using PHOENIX_BASE_FEE as default
          const fee =
            options.fee !== undefined
              ? options.fee
              : parseInt(constants.PHOENIX_BASE_FEE);
          const txOptions = { fee };

          // Log fee information
          if (options.fee !== undefined) {
            console.log(`Using custom transaction fee: ${fee} stroops`);
          } else {
            console.log(`Using default PHOENIX_BASE_FEE: ${fee} stroops`);
          }

          // Pass contract client and potential restore flag to transaction function
          const transaction = await transactionFunction(
            contractClient,
            restore,
            txOptions
          );

          // Store fee in outer scope for use in resolve callback
          const transactionFee = fee;

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
                  try {
                    await appStore.getAllTokens();
                  } catch (error) {
                    console.error("Error fetching all tokens:", error);
                  }
                } else {
                  const sentTransaction = await transaction.signAndSend();
                  console.log(
                    `Transaction sent with fee: ${transactionFee} stroops`
                  );
                  options.onSuccess?.(); // Call onSuccess callback after successful transaction
                  resolve({
                    transactionId:
                      sentTransaction.sendTransactionResponse?.hash,
                  });
                  appStore.getAllTokens();
                }
              } catch (error) {
                console.error(
                  "Error during signing and sending:",
                  JSON.stringify(error)
                );

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
