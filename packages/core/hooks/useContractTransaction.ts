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
import { useCallback } from "react";
import { usePersistStore } from "@phoenix-protocol/state";

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
    client: ContractClientType<T>
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

  console.log(commonOptions);

  const ClientConstructor = contractClients[contractType] as any;
  return new ClientConstructor(commonOptions);
};

export const useContractTransaction = () => {
  const { addAsyncToast } = useToast();
  const storePersist = usePersistStore();

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
      try {
        const contractClient = getContractClient(
          contractType,
          contractAddress,
          signer,
          networkPassphrase,
          rpcUrl,
          publicKey
        );

        const transaction = await transactionFunction(contractClient);
        const promise: Promise<{ transactionId?: string }> = transaction
          .signAndSend()
          .then((sentTransaction: SentTransaction<any>) => {
            return {
              transactionId: sentTransaction.sendTransactionResponse?.hash,
            };
          });

        addAsyncToast(promise, loadingMessage);
      } catch (error) {
        console.error("Error executing contract transaction", error);
        addAsyncToast(Promise.reject(error), loadingMessage);
      }
    },
    [addAsyncToast, storePersist]
  );

  return { executeContractTransaction };
};
