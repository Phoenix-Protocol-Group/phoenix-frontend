import { BaseBlendStrategy } from "../BaseBlendStrategy";
import { StrategyMetadata } from "../../types";
import {
  PositionsEstimate,
  ReserveV2 as Reserve,
} from "@blend-capital/blend-sdk";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";
import { API } from "@phoenix-protocol/utils/build/trade_api";
import { constants } from "@phoenix-protocol/utils";

// Real Blend Pool and Asset addresses - need to find actual deployed Blend pools
// For now, we'll use native XLM and handle pool loading errors gracefully
const BLEND_XLM_POOL_ADDRESS =
  "CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD";
const XLM_CONTRACT_ADDRESS =
  "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA";

class BlendXLMLendingStrategy extends BaseBlendStrategy {
  constructor() {
    super(
      {
        id: "blend-xlm-lending",
        providerId: "blend",
        name: "XLM Lending",
        description: "Lend XLM on Blend and earn BLND rewards",
        assets: [
          {
            name: "XLM",
            icon: "/cryptoIcons/xlm.svg",
            amount: 0,
            category: "token",
            usdValue: 1.0,
            contractId: XLM_CONTRACT_ADDRESS,
          },
        ],
        tvl: 0, // Will be updated from Blend data
        apr: 0, // Will be updated asynchronously after construction
        rewardToken: {
          name: "BLND",
          icon: "/cryptoIcons/blend.svg",
          amount: 0,
          category: "token",
          usdValue: 0,
          contractId: "BLEND_TOKEN_ADDRESS", // Update with actual BLND token address
        },
        unbondTime: 0, // Lending allows instant withdrawal
        category: "lending",
        available: true,
        contractAddress: BLEND_XLM_POOL_ADDRESS,
        contractType: "stake",
        // Provider metadata
        providerName: "Blend",
        providerIcon: "/cryptoIcons/blend.svg",
        providerDomain: "blend.capital",
      },
      BLEND_XLM_POOL_ADDRESS,
      XLM_CONTRACT_ADDRESS
    );

    // Update APR asynchronously after construction
    this.getSupplyAPY().then((apy) => {
      this.metadata.apr = apy;
    });
  }

  // Implement the abstract methods from BaseBlendStrategy
  async getUserStake(walletAddress: string): Promise<number> {
    return this.getSupplyBalance(walletAddress);
  }

  async hasUserJoined(walletAddress: string): Promise<boolean> {
    const balance = await this.getSupplyBalance(walletAddress);
    return balance > 0;
  }

  async getUserRewards(walletAddress: string): Promise<number> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
      }

      if (this.pool) {
        const poolUser = await this.pool.loadUser(walletAddress);
        // Calculate rewards based on user's positions
        // This is a simplified calculation - actual implementation may vary
        const supplyBalance = await this.getSupplyBalance(walletAddress);
        const apy = await this.getSupplyAPY();
        // Estimate rewards based on time and APY (simplified)
        return supplyBalance * (apy / 100) * (1 / 365); // Daily rewards estimate
      }

      return 0;
    } catch (error) {
      console.error("Error getting user rewards:", error);
      return 0;
    }
  }

  // Use bond for supplying/lending
  async bond(
    walletAddress: string,
    amount: number
  ): Promise<AssembledTransaction<any>> {
    return this.supply(walletAddress, amount);
  }

  // Use unbond for withdrawing
  async unbond(
    walletAddress: string,
    params: number
  ): Promise<AssembledTransaction<any>> {
    return this.withdraw(walletAddress, params);
  }

  // Implementation-specific methods
  async getSupplyBalance(walletAddress: string): Promise<number> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
      }

      if (this.pool) {
        const poolUser = await this.pool.loadUser(walletAddress);

        const api = new API(constants.TRADING_API_URL);

        const userPositions = Array.from(this.pool.reserves.values());

        const xlmPrice = await api.getPrice(XLM_CONTRACT_ADDRESS);

        const tokens =
          (Number(poolUser.getSupply(userPositions[0])) / 1e7) * xlmPrice;

        return Number(tokens);
      }

      return 0;
    } catch (error) {
      console.error("Error getting supply balance:", error);
      return 0;
    }
  }
  async getSupplyAPY(): Promise<number> {
    try {
      const reserveData = await this.getReserveData();
      if (reserveData) {
        // Use the supplyApr property from Reserve
        return reserveData.supplyApr;
      }
      return 0;
    } catch (error) {
      console.error("Error getting supply APY:", error);
      return 0;
    }
  }

  async getReserveData(): Promise<Reserve | undefined> {
    try {
      if (!this.pool) {
        await this.waitForInitialization();
      }
      const api = new API(constants.TRADING_API_URL);
      const xlmPrice = await api.getPrice(XLM_CONTRACT_ADDRESS);

      const poolBalanceXlm =
        this.pool!.reserves.get(XLM_CONTRACT_ADDRESS)!.totalSupplyFloat();

      if (poolBalanceXlm) {
        // Update TVL based on pool balances
        this.metadata.tvl = Number(poolBalanceXlm) * xlmPrice;
      }

      if (this.pool) {
        return this.pool.reserves.get(XLM_CONTRACT_ADDRESS);
      }

      return undefined;
    } catch (error) {
      console.error("Error getting reserve data:", error);
      return undefined;
    }
  }

  private async getXLMReserveIndex(): Promise<number | undefined> {
    try {
      if (!this.pool) return undefined;

      // Find the reserve index for XLM
      // Since we need to map from assetId to index, we'll need to iterate
      let index = 0;
      for (const [assetId, reserve] of this.pool.reserves.entries()) {
        if (reserve.assetId === XLM_CONTRACT_ADDRESS) {
          return index;
        }
        index++;
      }

      return undefined;
    } catch (error) {
      console.error("Error getting XLM reserve index:", error);
      return undefined;
    }
  }
}

export default BlendXLMLendingStrategy;
