export const formatProgress = (value: number | undefined) => {
  if (value === undefined) return "Not Found";
  return Number(value.toFixed(2));
};
