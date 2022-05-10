import useSWR from "swr";
import { MintSplitFactory } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMintSplitFactory from "./useMintSplitFactory";

function getProjectsByUser(contract: MintSplitFactory, userAddress: string) {
  return async (_: string, address: string) => {
    const filter = contract.filters.ProjectCreated(null, userAddress);
    const results = await contract.queryFilter(filter);

    return results.map(({ args }) => args.project);
  };
}

export default function useProjectsByUser(
  userAddress: string,
  suspense = false
) {
  const contract = useMintSplitFactory();

  const shouldFetch = typeof userAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["ProjectsByUser", userAddress] : null,
    getProjectsByUser(contract, userAddress),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
