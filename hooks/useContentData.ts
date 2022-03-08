import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

const ipfsInfuraUrl = (str: string) => `https://ipfs.infura.io/ipfs/${str}`;
const cleanIpfsUrl = (url: string) => ipfsInfuraUrl(url.slice(7));
const parseName = (str: string) => str.slice(0, str.indexOf("•"));

function getContentData(contract: MintSplitERC721, contentId: number) {
  return async (_: string, address: string) => {
    const [supply, limit, baseURI] = await Promise.all([
      await contract.contentSupplies(contentId),
      await contract.supplyLimits(contentId - 1),
      await contract.baseURI(),
    ]);

    const response = await fetch(
      `${cleanIpfsUrl(baseURI)}${contentId}-1.json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { name, image, animation_url } = await response.json();

    const content = {
      name: parseName(name).trimEnd(),
      image: cleanIpfsUrl(image),
      audio: cleanIpfsUrl(animation_url),
    };

    return {
      content,
      supply,
      limit,
      baseURI,
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
