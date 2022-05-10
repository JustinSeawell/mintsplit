export const convertToBps = (percentage: number) =>
  Math.round((percentage / 100) * 10000);
