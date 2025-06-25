// Write a function to fetch from https://stats.phoenix-hub.io/api/tvl
export async function fetchTVL(): Promise<number> {
  try {
    const response = await fetch("https://stats.phoenix-hub.io/api/tvl");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.data && data.data.total_tvl_usd) {
      return data.data.total_tvl_usd;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching TVL:", error);
    return 0; // Return 0 or handle the error as needed
  }
}

// fetch pool tvl by poolId from https://stats.phoenix-hub.io/api/pools
export async function fetchTVLByPoolId(poolId: string): Promise<number> {
  try {
    const response = await fetch(`https://stats.phoenix-hub.io/api/pools`);
    if (!response.ok) {
      throw new Error(
        `Error fetching TVL for pool ID ${poolId}: ${response.statusText}`
      );
    }
    const pools = await response.json();

    const pool = pools.data.find(
      (p: { pool_address: string }) => p.pool_address === poolId
    );
    if (!pool) {
      throw new Error(`Pool with ID ${poolId} not found`);
    }

    if (!pool.tvl_usd) {
      throw new Error(`TVL for pool ID ${poolId} is not available`);
    }
    return pool.tvl_usd;
  } catch (error) {
    console.error(error);
    return 0; // Return 0 in case of an error
  }
}
