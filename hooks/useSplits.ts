import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getSplits(contract: MintSplitERC721, id: number, isMint: boolean) {
  return async (_: string, address: string) => {
    const split = await contract.getContentSplits(id, isMint);

    return split;
  };
}

export default function useSplits(
  contractAddress: string,
  id: number,
  isMint: boolean,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["Splits", contractAddress, id, isMint] : null,
    getSplits(contract, id, isMint),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
