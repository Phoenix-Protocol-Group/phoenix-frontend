// Real Blend protocol integration using the official Blend SDK
import { Strategy, StrategyMetadata } from "../types";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";
import {
  TransactionBuilder,
  rpc as SorobanRpc,
  Account,
  BASE_FEE,
  TimeoutInfinite,
  xdr,
} from "@stellar/stellar-sdk";
import {
  PoolContractV2 as PoolContract,
  PoolV2 as Pool,
  RequestType,
  Request,
  Network,
  Reserve,
  PoolUser,
  SubmitArgs,
} from "@blend-capital/blend-sdk";
import { constants, Signer } from "@phoenix-protocol/utils";
import { usePersistStore } from "@phoenix-protocol/state";

// Network configuration for Blend (using proper Soroban RPC)
export const BLEND_NETWORK: Network = {
  rpc: constants.RPC_URL, // Use the same RPC as Phoenix
  passphrase: constants.NETWORK_PASSPHRASE, // Use the same network as Phoenix
};

// Base interface for Blend lending strategies
export interface BlendLendingStrategy extends Strategy {
  supply(
    walletAddress: string,
    amount: number
  ): Promise<AssembledTransaction<any>>;
  withdraw(
    walletAddress: string,
    amount: number
  ): Promise<AssembledTransaction<any>>;
  getSupplyBalance(walletAddress: string): Promise<number>;
  getSupplyAPY(): Promise<number>;
  getReserveData(): Promise<Reserve | undefined>;
}

// Bridge class to convert Blend SDK transactions to Phoenix AssembledTransaction format
class BlendTransactionBridge {
  private poolContract: PoolContract;
  private poolAddress: string;
  private network: Network;

  constructor(poolAddress: string, network: Network) {
    this.poolAddress = poolAddress;
    this.network = network;
    this.poolContract = new PoolContract(poolAddress);
  }

  async createSupplyTransaction(
    walletAddress: string,
    reserveAssetAddress: string,
    amount: bigint
  ): Promise<AssembledTransaction<any>> {
    const supplyRequest: Request = {
      request_type: RequestType.Supply,
      address: reserveAssetAddress,
      amount: amount,
    };

    const submitArgs: SubmitArgs = {
      from: walletAddress,
      spender: walletAddress,
      to: walletAddress,
      requests: [supplyRequest],
    };

    return this.createAssembledTransaction(submitArgs, walletAddress, "supply");
  }

  async createWithdrawTransaction(
    walletAddress: string,
    reserveAssetAddress: string,
    amount: bigint
  ): Promise<AssembledTransaction<any>> {
    const withdrawRequest: Request = {
      request_type: RequestType.Withdraw,
      address: reserveAssetAddress,
      amount: amount,
    };

    const submitArgs: SubmitArgs = {
      from: walletAddress,
      spender: walletAddress,
      to: walletAddress,
      requests: [withdrawRequest],
    };

    return this.createAssembledTransaction(
      submitArgs,
      walletAddress,
      "withdraw"
    );
  }

  async createClaimTransaction(
    walletAddress: string,
    reserveTokenIds: string[] = []
  ): Promise<AssembledTransaction<any>> {
    return this.createClaimAssembledTransaction(walletAddress, reserveTokenIds);
  }

  private async createAssembledTransaction(
    submitArgs: SubmitArgs,
    walletAddress: string,
    operationType: string
  ): Promise<AssembledTransaction<any>> {
    // Get operation XDR from Blend SDK
    const operationXdr = this.poolContract.submit(submitArgs);

    // Create a proper AssembledTransaction that integrates with Phoenix wallet flow
    return {
      built: operationXdr, // Store the operation XDR for now
      simulate: async () => {
        // TODO: Implement proper simulation using Blend SDK if needed
        return { result: null };
      },
      signAndSend: async () => {
        try {
          // Use Phoenix's Signer class properly
          const signer = new Signer();

          // Get the wallet to ensure it's connected
          await signer.getWallet();

          // Build a complete transaction from the operation XDR
          // Fetch the account with correct sequence number
          const server = new SorobanRpc.Server(constants.RPC_URL);
          const accountResponse = await server.getAccount(walletAddress);
          const account = new Account(
            walletAddress,
            accountResponse.sequenceNumber()
          );
          const txBuilder = new TransactionBuilder(account, {
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            fee: constants.PHOENIX_BASE_FEE,
            timebounds: { maxTime: TimeoutInfinite, minTime: 0 },
          });

          // Add the Blend operation to the transaction
          const operation = xdr.Operation.fromXDR(operationXdr, "base64");
          txBuilder.addOperation(operation);

          // Build the complete transaction
          const transaction = txBuilder.build();

          // Step 1: Simulate the transaction to get resource costs for Soroban
          const simulateResponse = await server.simulateTransaction(
            transaction
          );

          if (SorobanRpc.Api.isSimulationError(simulateResponse)) {
            throw new Error(
              `Transaction simulation failed: ${simulateResponse.error}`
            );
          }

          // Step 2: Prepare the transaction with simulation results
          const preparedTransaction = SorobanRpc.assembleTransaction(
            transaction,
            simulateResponse
          ).build();

          // Step 3: Sign the prepared transaction
          const preparedTransactionXdr = preparedTransaction.toXDR();
          const signResult = await signer.sign(preparedTransactionXdr);

          // Step 4: Submit the signed, prepared transaction to the network
          const signedTransaction = TransactionBuilder.fromXDR(
            signResult.signedTxXdr,
            constants.NETWORK_PASSPHRASE
          );

          const response = await server.sendTransaction(signedTransaction);

          if (response.status === "ERROR") {
            throw new Error(`Transaction failed: ${response.errorResult}`);
          }

          // Wait for the transaction to be confirmed
          let getResponse = await server.getTransaction(response.hash);
          while (
            getResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
          ) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            getResponse = await server.getTransaction(response.hash);
          }

          return {
            hash: response.hash,
            response: getResponse,
            sendTransactionResponse: response,
          };
        } catch (error) {
          console.error("Error in signAndSend:", error);
          throw error;
        }
      },
    } as any;
  }

  private async createClaimAssembledTransaction(
    walletAddress: string,
    reserveTokenIds: string[]
  ): Promise<AssembledTransaction<any>> {
    // Get claim operation XDR from Blend SDK
    const operationXdr = this.poolContract.claim({
      from: walletAddress,
      reserve_token_ids: reserveTokenIds.map((id) => parseInt(id, 10)),
      to: walletAddress,
    });

    // Create a simplified AssembledTransaction
    return {
      built: operationXdr, // Store the operation XDR
      simulate: async () => ({ result: null }),
      signAndSend: async () => {
        try {
          const signer = new Signer();
          await signer.getWallet();

          // Build a complete transaction from the operation XDR
          const server = new SorobanRpc.Server(constants.RPC_URL);
          const accountResponse = await server.getAccount(walletAddress);
          const account = new Account(
            walletAddress,
            accountResponse.sequenceNumber()
          );
          const txBuilder = new TransactionBuilder(account, {
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            fee: BASE_FEE,
            timebounds: { maxTime: TimeoutInfinite, minTime: 0 },
          });

          // Add the Blend operation to the transaction
          const operation = xdr.Operation.fromXDR(operationXdr, "base64");
          txBuilder.addOperation(operation);

          // Build the complete transaction
          const transaction = txBuilder.build();

          // Step 1: Simulate the transaction to get resource costs for Soroban
          const simulateResponse = await server.simulateTransaction(
            transaction
          );

          if (SorobanRpc.Api.isSimulationError(simulateResponse)) {
            throw new Error(
              `Claim transaction simulation failed: ${simulateResponse.error}`
            );
          }

          // Step 2: Prepare the transaction with simulation results
          const preparedTransaction = SorobanRpc.assembleTransaction(
            transaction,
            simulateResponse
          ).build();

          // Step 3: Sign the prepared transaction
          const preparedTransactionXdr = preparedTransaction.toXDR();
          const signResult = await signer.sign(preparedTransactionXdr);

          // Step 4: Submit the signed, prepared transaction to the network
          const signedTransaction = TransactionBuilder.fromXDR(
            signResult.signedTxXdr,
            constants.NETWORK_PASSPHRASE
          );

          const response = await server.sendTransaction(signedTransaction);

          if (response.status === "ERROR") {
            console.error(
              `Claim transaction failed: ${JSON.stringify(
                response.errorResult
              )}`
            );
            throw new Error(
              `Claim transaction failed: ${JSON.stringify(
                response.errorResult
              )}`
            );
          }

          // Wait for the transaction to be confirmed
          let getResponse = await server.getTransaction(response.hash);
          while (
            getResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
          ) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            getResponse = await server.getTransaction(response.hash);
          }

          return {
            hash: response.hash,
            response: getResponse,
            sendTransactionResponse: response,
          };
        } catch (error) {
          console.error("Error in claim signAndSend:", error);
          throw error;
        }
      },
    } as any; // Use 'as any' to bypass strict typing for now
  }
}

// Base implementation for Blend strategies
export abstract class BaseBlendStrategy implements BlendLendingStrategy {
  protected metadata: StrategyMetadata;
  protected poolAddress: string;
  protected reserveAssetAddress: string;
  protected network: Network;
  private initialized: boolean = false;
  protected pool: Pool | null = null;
  protected transactionBridge: BlendTransactionBridge;

  constructor(
    metadata: StrategyMetadata,
    poolAddress: string,
    reserveAssetAddress: string
  ) {
    this.metadata = {
      ...metadata,
      providerName: "Blend",
      providerIcon: "/cryptoIcons/blend.svg",
      providerDomain: "blend.capital",
      category: "lending",
    };

    this.poolAddress = poolAddress;
    this.reserveAssetAddress = reserveAssetAddress;
    this.network = BLEND_NETWORK;
    this.transactionBridge = new BlendTransactionBridge(
      poolAddress,
      this.network
    );

    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Try to load the pool with better error handling
      console.log(`Initializing Blend strategy for pool: ${this.poolAddress}`);
      this.pool = await Pool.load(this.network, this.poolAddress);
      console.log(`Loaded pool: ${this.poolAddress}`);
      await this.updateMetadata();
      this.initialized = true;
      console.log(
        `Successfully initialized Blend strategy for pool: ${this.poolAddress}`
      );
    } catch (error) {
      console.error("Failed to initialize Blend strategy:", error);
      // Set initialized to true anyway to prevent blocking, but mark pool as null
      // This allows the strategy to show up in the UI but with appropriate error handling
      this.initialized = true;
      this.pool = null;

      // Update metadata with fallback values
      this.metadata.apr = 0;
      this.metadata.tvl = 0;
      this.metadata.available = false; // Mark as unavailable due to initialization failure
    }
  }

  private async updateMetadata(): Promise<void> {
    try {
      if (this.pool) {
        const reserveData = await this.getReserveData();
        if (reserveData) {
          // Calculate TVL and APR from reserve data
          this.metadata.apr = await this.getSupplyAPY();
        }
      }
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  }

  protected async waitForInitialization(timeout = 5000): Promise<void> {
    const start = Date.now();
    while (!this.initialized && Date.now() - start < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  abstract getSupplyBalance(walletAddress: string): Promise<number>;
  abstract getSupplyAPY(): Promise<number>;
  abstract getReserveData(): Promise<Reserve | undefined>;

  async getMetadata(): Promise<StrategyMetadata> {
    if (!this.initialized) {
      await this.waitForInitialization();
    }
    return this.metadata;
  }

  async getUserStake(walletAddress: string): Promise<number> {
    return this.getSupplyBalance(walletAddress);
  }

  async hasUserJoined(walletAddress: string): Promise<boolean> {
    const balance = await this.getSupplyBalance(walletAddress);
    return balance > 0;
  }

  async getUserRewards(walletAddress: string): Promise<number> {
    try {
      if (!this.pool) return 0;
      const poolUser = await this.pool.loadUser(walletAddress);
      // Calculate claimable rewards based on Blend's reward system
      return 0; // TODO: Implement based on actual Blend reward mechanics
    } catch (error) {
      console.error("Error getting user rewards:", error);
      return 0;
    }
  }

  async supply(
    walletAddress: string,
    amount: number
  ): Promise<AssembledTransaction<any>> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
        if (!this.pool) {
          throw new Error("Pool not loaded");
        }
      }

      // Convert amount to the correct precision (assuming 7 decimals for Stellar assets)
      const scaledAmount = BigInt(Math.floor(amount * 1e7));

      const tx = await this.transactionBridge.createSupplyTransaction(
        walletAddress,
        this.reserveAssetAddress,
        scaledAmount
      );
      console.log(tx);
      return tx;
    } catch (error) {
      console.error("Error in supply:", error);
      throw error;
    }
  }

  async withdraw(
    walletAddress: string,
    amount: number
  ): Promise<AssembledTransaction<any>> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
        if (!this.pool) {
          throw new Error("Pool not loaded");
        }
      }

      // Convert amount to the correct precision
      const scaledAmount = BigInt(Math.floor(amount * 1e7));

      return await this.transactionBridge.createWithdrawTransaction(
        walletAddress,
        this.reserveAssetAddress,
        scaledAmount
      );
    } catch (error) {
      console.error("Error in withdraw:", error);
      throw error;
    }
  }

  async bond(
    walletAddress: string,
    amountA: number
  ): Promise<AssembledTransaction<any>> {
    return this.supply(walletAddress, amountA);
  }

  async unbond(
    walletAddress: string,
    params: number
  ): Promise<AssembledTransaction<any>> {
    return this.withdraw(walletAddress, params);
  }

  async claim(walletAddress: string): Promise<AssembledTransaction<any>> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
        if (!this.pool) {
          throw new Error("Pool not loaded");
        }
      }

      // Get reserve token IDs for claiming rewards
      const reserveTokenIds: string[] = []; // TODO: Implement based on user's positions

      return await this.transactionBridge.createClaimTransaction(
        walletAddress,
        reserveTokenIds
      );
    } catch (error) {
      console.error("Error in claim:", error);
      throw error;
    }
  }
}
