// Timestamp to local date string
export const timestampToLocalDateString = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};
