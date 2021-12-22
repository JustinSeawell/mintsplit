import AUDIO_NFT_ABI from "../contracts/AudioNFT.json";
import { AudioNFT } from "../contracts/types";
import useContract from "./useContract";

export default function useAudioNFTContract(address?: string) {
  return useContract<AudioNFT>(address, AUDIO_NFT_ABI);
}
