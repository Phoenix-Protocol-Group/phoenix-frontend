import axios from "axios";
import { format, subDays, subMonths, subYears } from "date-fns";

const BASE_URL = "/api/indexer";

function mapTimeEpochToDateRange(timeEpoch: "monthly" | "daily" | "yearly") {
  const now = new Date();

  switch (timeEpoch) {
    case "monthly": {
      const startTime = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const endTime = now; // Include today
      return {
        startTime: Math.floor(startTime.getTime() / 1000).toString(),
        endTime: Math.floor(endTime.getTime() / 1000).toString(),
      };
    }
    case "daily": {
      const startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const endTime = now; // Include today
      return {
        startTime: Math.floor(startTime.getTime() / 1000).toString(),
        endTime: Math.floor(endTime.getTime() / 1000).toString(),
      };
    }
    case "yearly": {
      const startTime = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      const endTime = now; // Include today
      return {
        startTime: Math.floor(startTime.getTime() / 1000).toString(),
        endTime: Math.floor(endTime.getTime() / 1000).toString(),
      };
    }
    default:
      throw new Error("Invalid time epoch specified.");
  }
}

async function fetchTickers() {
  try {
    const response = await axios.get(`${BASE_URL}/tickers`);
    return response.data.map((ticker: any) => ticker.ticker_id);
  } catch (error) {
    console.log("Error fetching tickers:", error);
    throw error;
  }
}
export async function fetchDataByTimeEpoch(
  timeEpoch: "monthly" | "daily" | "yearly"
) {
  const dateRange = mapTimeEpochToDateRange(timeEpoch);

  try {
    const tickers = await fetchTickers();

    const results = await Promise.all(
      tickers.map(async (tickerId: string) => {
        const response = await axios.get(`${BASE_URL}/historical_trades`, {
          params: {
            tickerId,
            limit: 5000,
            ...dateRange,
          },
        });

        const trades = response.data;

        // Determine bucket format based on the epoch
        const bucketFormat =
          timeEpoch === "daily"
            ? "MM-dd HH:00" // Hourly intervals
            : timeEpoch === "monthly"
            ? "MM-dd" // Daily intervals
            : "yyyy-MM"; // Monthly interval

        // Aggregate trades into buckets
        const aggregatedBuckets: Record<string, number> = trades.reduce(
          (acc: any, trade: any) => {
            const bucketKey = format(
              new Date(Number(trade.trade_timestamp)),
              bucketFormat
            );
            const tradeVolume = trade.price * trade.base_volume;
            acc[bucketKey] = (acc[bucketKey] || 0) + tradeVolume;
            return acc;
          },
          {}
        );

        // Convert the aggregated buckets into the desired structure
        const intervals = Object.entries(aggregatedBuckets).map(
          ([timestamp, volume]) => ({
            timestamp,
            volume,
          })
        );

        // Sum up total volume
        const totalVolume = intervals.reduce(
          (sum, interval) => sum + interval.volume,
          0
        );

        return { totalVolume, intervals };
      })
    );

    // Aggregate total volume across all tickers
    const aggregatedResult = results.reduce(
      (acc, data) => {
        acc.totalVolume += data.totalVolume;
        acc.intervals.push(...data.intervals);
        return acc;
      },
      { totalVolume: 0, intervals: [] }
    );

    // Sort intervals by timestamp
    aggregatedResult.intervals.sort((a: any, b: any) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    console.log({
      [`volume${
        timeEpoch === "monthly"
          ? "Month"
          : timeEpoch === "daily"
          ? "24h"
          : "Year"
      }`]: aggregatedResult,
    });

    return {
      [`volume${
        timeEpoch === "monthly"
          ? "Month"
          : timeEpoch === "daily"
          ? "24h"
          : "Year"
      }`]: aggregatedResult,
    };
  } catch (error) {
    console.log(`Error fetching ${timeEpoch} data:`, error);
    throw error;
  }
}
