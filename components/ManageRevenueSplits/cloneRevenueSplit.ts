import {
  RevenueSplit,
  RevenueSplitConfig,
} from "../../types/RevenueSplitConfig";

const cloneRevenueSplits = (oldRevenueSplits: RevenueSplit[]) =>
  oldRevenueSplits.map((split) => ({ ...split } as RevenueSplit));

export const cloneRevenueSplitConfig = (
  oldRevenueSplit: RevenueSplitConfig
) => {
  const clonedSplits = cloneRevenueSplits(oldRevenueSplit.splits);

  return {
    ...oldRevenueSplit,
    tokenRange: [...oldRevenueSplit.tokenRange],
    splits: [...clonedSplits],
  } as RevenueSplitConfig;
};
