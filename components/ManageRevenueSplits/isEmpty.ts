import { PaymentSplitStruct } from "../../contracts/types/MintSplitERC721";

export const isEmpty = (split: PaymentSplitStruct) =>
  !split || split?.recipients?.length === 0;
