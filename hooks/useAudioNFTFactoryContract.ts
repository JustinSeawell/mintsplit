import AUDIO_NFT_FACTORY_ABI from "../contracts/AudioNFTFactory.json";
import useContract from "./useContract";
import type { AudioNFTFactory } from "../contracts/types";

export default function useAudioNFTFactoryContract(address?: string) {
  return useContract<AudioNFTFactory>(address, AUDIO_NFT_FACTORY_ABI);
}
