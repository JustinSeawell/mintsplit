export type RevenueSplit = {
  recipient: string; // solidity address
  bps: number; // basis points
};

export type RevenueSplitConfig = {
  tokenRange: [number, number];
  splits: RevenueSplit[];
};
