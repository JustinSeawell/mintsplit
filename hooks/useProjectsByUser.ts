import useSWR from "swr";
import { MintSplitFactoryV1 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMintSplitFactory from "./useMintSplitFactory";

function getProjectsByUser(contract: MintSplitFactoryV1, userAddress: string) {
  return async (_: string, address: string) => {
    const userProjects = await contract.getUserProjects(userAddress);

    return userProjects;
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
