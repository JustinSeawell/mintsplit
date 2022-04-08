import { BigNumber } from "ethers";
import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import { Collection } from "../types/Collection";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getCollectionData(contract: MintSplitERC721) {
  return async (_: string, address: string) => {
    const [params, isPaused, revenueSplitter] = await Promise.all([
      await contract.getParams(),
      await contract.paused(),
      await contract.revenueSplitter(),
    ]);

    const {
      projectName: name,
      symbol,
      contentCount,
      mintPrice,
      // releaseTime,
      editions,
    } = params;

    const totalSupplyLimit = editions.reduce(
      (prev, value) => prev.add(value),
      BigNumber.from(0)
    );

    return {
      name,
      symbol,
      contentCount,
      isPaused,
      mintPrice,
      totalSupply: BigNumber.from(10), // TODO: Update contract to make this number public
      secondsUntilMinting: 0, // TODO: calculate this #
      totalSupplyLimit: BigNumber.from(1),
      revenueSplitter: revenueSplitter,
    } as Collection;
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
