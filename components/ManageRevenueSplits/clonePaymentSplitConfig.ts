import {
  PaymentSplitConfigStruct,
  PaymentSplitStruct,
} from "../../contracts/types/RevenueSplitter";

const clonePaymentSplit = ({ recipients, bps }: PaymentSplitStruct) =>
  ({
    recipients: [...recipients],
    bps: [...bps],
  } as PaymentSplitStruct);

export const clonePaymentSplitConfig = (oldConfig: PaymentSplitConfigStruct) =>
  ({
    ...oldConfig,
    split: clonePaymentSplit(oldConfig.split),
  } as PaymentSplitConfigStruct);
