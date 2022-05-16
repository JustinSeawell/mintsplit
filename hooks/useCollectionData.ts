import { BigNumber } from "ethers";
import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getCollectionData(contract: MintSplitERC721) {
  return async (_: string, address: string) => {
    try {
      const [params, editions, tokens, isPaused, totalBalance, owner] =
        await Promise.all([
          await contract.getParams(),
          await contract.getEditions(),
          await contract.tokens(),
          await contract.isPaused(),
          await contract.totalBalance(),
          await contract.owner(),
        ]);

      const totalEditions = editions.reduce(
        (sum, edition) => sum.add(edition),
        BigNumber.from(0)
      );

      return {
        params,
        editions,
        totalEditions,
        tokens,
        isPaused,
        totalBalance,
        owner,
      };
    } catch (err) {
      console.error(err);
    }
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
