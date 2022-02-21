import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { RevenueSplitConfig } from "../types/RevenueSplitConfig";

interface RevenueSplitContextValue {
  mintSplits: RevenueSplitConfig[];
  setMintSplits: Dispatch<SetStateAction<RevenueSplitConfig[]>>;
  royaltySplits: RevenueSplitConfig[];
  setRoyaltySplits: Dispatch<SetStateAction<RevenueSplitConfig[]>>;
}

const RevenueSplitContext = createContext<RevenueSplitContextValue>(null);

export const RevenueSplitProvider = ({ children }) => {
  const [mintSplits, setMintSplits] = useState<RevenueSplitConfig[]>([]);
  const [royaltySplits, setRoyaltySplits] = useState<RevenueSplitConfig[]>([]);

  return (
    <RevenueSplitContext.Provider
      value={{ mintSplits, setMintSplits, royaltySplits, setRoyaltySplits }}
    >
      {children}
    </RevenueSplitContext.Provider>
  );
};

export const useRevenueSplits = () => useContext(RevenueSplitContext);
