import { gql } from "@apollo/client";
import { createApolloClient } from "./apolloClient";
import { format } from "date-fns/format";

export async function fetchDataByTimeEpoch(
  timeEpoch: "monthly" | "daily" | "yearly"
) {
  const client = createApolloClient();
  let query = null;

  let dateFormat = ""; // Initialize the date format variable

  switch (timeEpoch) {
    case "monthly":
      query = gql`
        query GetMonthlyData {
          volumeMonth {
            totalVolume
            intervals {
              timestamp
              volume
            }
          }
        }
      `;
      dateFormat = "dd.MM"; // Set the date format for monthly data
      break;
    case "daily":
      query = gql`
        query GetDailyData {
          volume24h {
            totalVolume
            intervals {
              timestamp
              volume
            }
          }
        }
      `;
      dateFormat = "HH:mm 'h'"; // Set the date format for daily data
      break;
    case "yearly":
      query = gql`
        query GetYearlyData {
          volumeYear {
            totalVolume
            intervals {
              timestamp
              volume
            }
          }
        }
      `;
      dateFormat = "MM.yy"; // Set the date format for yearly data
      break;
    default:
      throw new Error("Invalid time epoch specified.");
  }

  if (!query) {
    throw new Error("Invalid time epoch specified.");
  }

  try {
    const { data } = await client.query({
      query,
    });

    const resolveName = (name: string) => {
      switch (name) {
        case "monthly":
          return "volumeMonth";
        case "daily":
          return "volume24h";
        case "yearly":
          return "volumeYear";
        default:
          throw new Error("Invalid time epoch specified.");
      }
    };

    const _timeEpoch = resolveName(timeEpoch);

    // Format the timestamps in the response
    const formattedData = {
      ...data,
      [_timeEpoch]: {
        ...data[_timeEpoch],
        intervals: data[_timeEpoch].intervals.map(
          (interval: { timestamp: string; volume: number }) => ({
            volume: interval.volume,
            timestamp: format(new Date(interval.timestamp), dateFormat),
          })
        ),
      },
    };

    return formattedData;
  } catch (error) {
    console.error(`Error fetching ${timeEpoch} data:`, error);
    throw error;
  }
}
