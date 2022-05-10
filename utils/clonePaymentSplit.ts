import { PaymentSplitStruct } from "../contracts/types/MintSplitERC721";

export const clonePaymentSplit = ({ recipients, bps }: PaymentSplitStruct) =>
  ({
    recipients: [...recipients],
    bps: [...bps],
  } as PaymentSplitStruct);
