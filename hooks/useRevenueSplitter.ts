import useContract from "./useContract";
import REVENUE_SPLITTER_ABI from "../contracts/RevenueSplitter.json";
import { RevenueSplitter } from "../contracts/types";

export default function useRevenueSplitter(address?: string) {
  return useContract<RevenueSplitter>(address, REVENUE_SPLITTER_ABI);
}
