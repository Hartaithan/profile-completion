export const formatProgress = (value: number | undefined) => {
  if (!value) return "Not Found";
  return Number(value.toFixed(2));
};
