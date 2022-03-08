export const convertToPercentage = (bps: number) => bps / 100;

export const convertToBps = (percentage: number) =>
  Math.round((percentage / 100) * 10000);
