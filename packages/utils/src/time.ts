// Timestamp to local date string
export const timestampToLocalDateString = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export function daysSinceTimestamp(timestamp: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const currentTimestamp = Date.now();
  const timeDifference = currentTimestamp - timestamp * 1000; // Convert to milliseconds

  const fullDays = Math.floor(timeDifference / millisecondsPerDay);
  return fullDays;
}
