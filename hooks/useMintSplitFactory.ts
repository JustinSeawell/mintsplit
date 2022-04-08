import MINTSPLIT_FACTORY_ABI from "../contracts/MintSplitFactory.json";
import useContract from "./useContract";
import type { MintSplitFactory } from "../contracts/types";

export default function useMintSplitFactory() {
  return useContract<MintSplitFactory>(
    process.env.NEXT_PUBLIC_MINTSPLIT_FACTORY_ADDRESS,
    MINTSPLIT_FACTORY_ABI
  );
}
