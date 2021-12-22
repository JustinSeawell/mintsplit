import useSWR from "swr";
import { AudioNFT } from "../contracts/types";
import useAudioNFTContract from "./useAudioNFTContract";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getCollectionData(contract: AudioNFT) {
  return async (_: string, address: string) => {
    const [name, cost, totalSupply, maxSupply, allowMintingAfter, isRevealed] =
      await Promise.all([
        await contract.name(),
        await contract.cost(),
        await contract.totalSupply(),
        await contract.maxSupply(),
        await contract.allowMintingAfter(),
        await contract.isRevealed(),
      ]);

    return {
      name,
      cost,
      totalSupply,
      maxSupply,
      allowMintingAfter,
      isRevealed,
    };
  };
}

export default function useCollectionData(
  contractAddress: string,
  suspense = false
) {
  const contract = useAudioNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["CollectionData", contractAddress] : null,
    getCollectionData(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
