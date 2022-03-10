import { BigNumber } from "ethers";
import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getCollectionData(contract: MintSplitERC721) {
  return async (_: string, address: string) => {
    const [
      name,
      contentCount,
      mintLimit,
      isPaused,
      mintPrice,
      totalSupply,
      secondsUntilMinting,
      supplyLimits,
      maxLimit,
    ] = await Promise.all([
      await contract.name(),
      await contract.contentCount(),
      await contract.mintLimit(),
      await contract.isPaused(),
      await contract.mintPrice(),
      await contract.totalSupply(),
      await contract.getSecondsUntilMinting(),
      await contract.getSupplyLimits(),
      await contract.maxLimit(),
    ]);

    const totalSupplyLimit = supplyLimits.reduce(
      (prev, value) => prev.add(value),
      BigNumber.from(0)
    );

    return {
      name,
      contentCount,
      mintLimit,
      isPaused,
      mintPrice,
      totalSupply,
      secondsUntilMinting,
      totalSupplyLimit,
      maxLimit,
    };
  };
}

export default function useCollectionData(
  contractAddress: string,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["CollectionData", contractAddress] : null,
    getCollectionData(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
