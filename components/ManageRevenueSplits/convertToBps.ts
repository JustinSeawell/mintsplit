export const convertToPercentage = (bps: number) => bps / 100;

export const convertToBps = (percentage: number) => (percentage / 100) * 10000;
