import { useWeb3React } from "@web3-react/core";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { PaymentSplitConfigStruct } from "../contracts/types/RevenueSplitter";
import { RevenueSplitConfig } from "../types/RevenueSplitConfig";

interface RevenueSplitContextValue {
  addresses: string[];
  setAddresses: Dispatch<SetStateAction<string[]>>;
  mintSplits: PaymentSplitConfigStruct[];
  setMintSplits: Dispatch<SetStateAction<PaymentSplitConfigStruct[]>>;
  royaltySplits: PaymentSplitConfigStruct[];
  setRoyaltySplits: Dispatch<SetStateAction<PaymentSplitConfigStruct[]>>;
}

const RevenueSplitContext = createContext<RevenueSplitContextValue>(null);

export const RevenueSplitProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [mintSplits, setMintSplits] = useState<PaymentSplitConfigStruct[]>([]);
  const [royaltySplits, setRoyaltySplits] = useState<
    PaymentSplitConfigStruct[]
  >([]);

  return (
    <RevenueSplitContext.Provider
      value={{
        addresses,
        setAddresses,
        mintSplits,
        setMintSplits,
        royaltySplits,
        setRoyaltySplits,
      }}
    >
      {children}
    </RevenueSplitContext.Provider>
  );
};

export const useRevenueSplits = () => useContext(RevenueSplitContext);
