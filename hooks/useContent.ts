import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import { Content } from "../types/Content";
import { ipfsToHttp, parseName } from "../util";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getContent(contract: MintSplitERC721, contentId: number) {
  return async (_: string, address: string) => {
    const [contentURI] = await Promise.all([
      await contract.contentURI(contentId),
    ]);

    let uri = contentURI;

    if (!uri) {
      const { baseURI } = await contract.getParams();
      uri = baseURI;
    }

    const response = await fetch(`${ipfsToHttp(uri)}${contentId}-1.json`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { name, image, attributes } = await response.json();

    return {
      id: contentId,
      name: name.includes("•") ? parseName(name) : name,
      editions: parseInt(attributes[3].value),
      artURI: ipfsToHttp(image),
    } as Content;
  };
}

export default function useContent(
  contractAddress: string,
  contentId: number,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["Content", contractAddress, contentId] : null,
    getContent(contract, contentId),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
