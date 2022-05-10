import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import { MetaData } from "../types/MetaData";
import { ipfsToHttp, parseName } from "../util";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getMetaData(contract: MintSplitERC721, contentId: number) {
  return async (_: string, address: string) => {
    let uri = await contract.contentURI(contentId);

    if (!uri) {
      const { baseURI } = await contract.getParams();
      uri = baseURI;
    }

    const response = await fetch(`${ipfsToHttp(uri)}${contentId}-1.json`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { name, image, animation_url, description, attributes } =
      await response.json();

    return {
      name: name.includes("•") ? parseName(name) : name,
      image,
      animation_url,
      description,
      attributes,
    } as MetaData;
  };
}

export default function useMetaData(
  contractAddress: string,
  contentId: number,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["MetaData", contractAddress, contentId] : null,
    getMetaData(contract, contentId),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
