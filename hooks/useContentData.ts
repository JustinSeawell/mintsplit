import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import { ipfsToHttp, parseName } from "../util";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getContentData(contract: MintSplitERC721, contentId: number) {
  return async (_: string, address: string) => {
    const [supply, limit, contentURI] = await Promise.all([
      await contract.contentSupply(contentId),
      await contract.editions(contentId - 1),
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
    const { name, image, animation_url, description, attributes } =
      await response.json();
    const [song, artist] = attributes;

    const content = {
      name: name.includes("•") ? parseName(name) : name,
      image: ipfsToHttp(image),
      audio: ipfsToHttp(animation_url),
    };

    return {
      content,
      supply,
      limit,
      contentURI,
      description,
      artist: artist.value,
    };
  };
}

export default function useContentData(
  contractAddress: string,
  contentId: number,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["ContentData", contractAddress, contentId] : null,
    getContentData(contract, contentId),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
