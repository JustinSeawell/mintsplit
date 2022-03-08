import MINTSPLIT_NFT_ABI from "../contracts/MintSplitERC721.json";
import { MintSplitERC721 } from "../contracts/types";
import useContract from "./useContract";

export default function useNFTContract(address?: string) {
  return useContract<MintSplitERC721>(address, MINTSPLIT_NFT_ABI);
}
