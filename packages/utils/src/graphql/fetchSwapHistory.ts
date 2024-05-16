import { gql } from "@apollo/client";
import { createApolloClient } from "./apolloClient";
import { ActiveFilters } from "@phoenix-protocol/types";

interface SwapResult {
  type: "Success" | "Failed";
  assets: any[];
  tradeSize: string;
  tradeValue: string;
  date: string;
  txHash: string;
}

export async function fetchSwapHistory(
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  filters: ActiveFilters,
  accountId?: string
): Promise<SwapResult[]> {
  const client = createApolloClient();
  const offset = page * pageSize;

  const GET_SWAPS = gql`
    query GetSwaps(
      $pageSize: Int
      $sortBy: String
      $sortOrder: String
      $offset: Int
      $filters: ActiveFiltersInput
    ) {
      swaps(
        sortBy: $sortBy
        sortOrder: $sortOrder
        limit: $pageSize
        offset: $offset
        filters: $filters
      ) {
        id
        accountId
        swapSteps {
          ask_asset
          offer_asset
        }
        fromAmount
        timestamp
        usdValue
      }
    }
  `;

  const GET_SWAPS_PERSONAL = gql`
    query GetSwapsPersonal(
      $pageSize: Int
      $sortBy: String
      $sortOrder: String
      $offset: Int
      $accountId: String
      $filters: ActiveFiltersInput
    ) {
      swapByAccountId(
        sortBy: $sortBy
        accountId: $accountId
        sortOrder: $sortOrder
        limit: $pageSize
        offset: $offset
        filters: $filters
      ) {
        id
        accountId
        swapSteps {
          ask_asset
          offer_asset
        }
        fromAmount
        timestamp
        usdValue
      }
    }
  `;
  
  try {
    if (accountId) {
      const { data } = await client.query({
        query: GET_SWAPS_PERSONAL,
        variables: {
          page,
          pageSize,
          sortBy,
          sortOrder,
          accountId,
          offset,
          filters,
        },
      });

      if (data.swapByAccountId) {
        // Map the fetched swaps to the desired output structure
        const swapResults: SwapResult[] = data.swapByAccountId.map(
          (swap: any) => ({
            type: "Success", // TODO: Handle failed swaps
            assets: swap.swapSteps,
            tradeSize: swap.fromAmount,
            tradeValue: swap.usdValue.toString(),
            date: swap.timestamp,
            txHash: swap.id,
          })
        );

        return swapResults;
      } else {
        // Handle the case where there are no swaps found
        return [];
      }
    }
    const { data } = await client.query({
      query: GET_SWAPS,
      variables: {
        page,
        pageSize,
        sortBy,
        sortOrder,
        offset,
        filters,
      },
    });

    if (data.swaps) {
      // Map the fetched swaps to the desired output structure
      const swapResults: SwapResult[] = data.swaps.map((swap: any) => ({
        type: "Success", // TODO: Handle failed swaps
        assets: swap.swapSteps,
        tradeSize: swap.fromAmount,
        tradeValue: swap.usdValue.toString(),
        date: swap.timestamp,
        txHash: swap.id,
      }));

      return swapResults;
    } else {
      // Handle the case where there are no swaps found
      return [];
    }
  } catch (error) {
    console.error("Error fetching swaps:", error);
    throw error;
  }
}
