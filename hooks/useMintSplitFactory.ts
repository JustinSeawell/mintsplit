import MINTSPLIT_FACTORY_ABI from "../contracts/MintSplitFactoryV1.json";
import useContract from "./useContract";
import type { MintSplitFactoryV1 } from "../contracts/types";

export default function useMintSplitFactory() {
  return useContract<MintSplitFactoryV1>(
    process.env.NEXT_PUBLIC_MINTSPLIT_FACTORY_ADDRESS,
    MINTSPLIT_FACTORY_ABI
  );
}
