import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getDefaultSplits(contract: MintSplitERC721) {
  return async (_: string, address: string) => {
    const [defaultSplits] = await Promise.all([
      await contract.getDefaultSplits(),
    ]);

    return defaultSplits;
  };
}

export default function useDefaultSplits(
  contractAddress: string,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["DefaultSplits", contractAddress] : null,
    getDefaultSplits(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
