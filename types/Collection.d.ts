import { BigNumber } from "ethers";

export type Collection = {
  name: string;
  symbol: string;
  contentCount: BigNumber;
  isPaused: boolean;
  mintPrice: BigNumber;
  totalSupply: BigNumber;
  secondsUntilMinting: number;
  totalSupplyLimit: BigNumber;
  revenueSplitter: string;
};
