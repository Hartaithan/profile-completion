export const toFixed = (value: number, fraction = 1): number => {
  return parseFloat(value.toFixed(fraction));
};

const formatter = new Intl.NumberFormat("de-DE");
export const formatNumber = (num: number): string => {
  return formatter.format(num);
};
