/**
 * Converts a timestamp to a local date string
 * @param {number} timestamp
 * @returns {string} Local date string
 * @example
 * timestampToLocalDateString(1620000000000) // '5/3/2021'
 */
export const timestampToLocalDateString = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

/**
 * Converts a timestamp to a local date and time string
 * @param {number} timestamp
 * @returns {string} Local date and time string
 * @example
 * timestampToLocalDateTimeString(1620000000000) // '5/3/2021, 12:00:00 PM'
 */
export function daysSinceTimestamp(timestamp: number): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const currentTimestamp = Date.now();
  const timeDifference = currentTimestamp - timestamp * 1000; // Convert to milliseconds

  const fullDays = Math.floor(timeDifference / millisecondsPerDay);
  return fullDays;
}
