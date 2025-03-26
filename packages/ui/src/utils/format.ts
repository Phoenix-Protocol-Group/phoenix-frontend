/**
 * Format a number for display with K/M/B suffixes
 * @param num The number to format
 * @param digits Number of decimal places (default: 1)
 */
export const formatNumber = (num: number, digits = 1): string => {
  if (!num && num !== 0) return 'N/A';
  
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  
  const item = lookup
    .slice()
    .reverse()
    .find(function(item) {
      return num >= item.value;
    });
    
  return item
    ? (num / item.value).toFixed(digits) + item.symbol
    : "0";
};

/**
 * Shorten an address for display
 * @param address The address to shorten
 * @param chars Number of characters to show at start/end (default: 6)
 */
export const shortenAddress = (address: string, chars = 6): string => {
  if (!address) return '';
  
  if (address.length <= chars * 2) return address;
  
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Format a date for display
 * @param timestamp Timestamp in seconds or milliseconds
 * @param includeTime Include time in the formatted result
 */
export const formatDate = (timestamp: number, includeTime = false): string => {
  if (!timestamp) return 'N/A';
  
  // Convert to milliseconds if needed
  const date = new Date(timestamp * (timestamp < 10000000000 ? 1000 : 1));
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return date.toLocaleDateString('en-US', options);
};
