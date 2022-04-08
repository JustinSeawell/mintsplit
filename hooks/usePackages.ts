import useSWR from "swr";
import { MintSplitFactory } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMintSplitFactory from "./useMintSplitFactory";

function getPackages(contract: MintSplitFactory) {
  return async (_: string, address: string) => {
    const packages = await contract.getPackages();

    return packages;
  };
}

export default function usePackages(suspense = false) {
  const contract = useMintSplitFactory();

  const shouldFetch = !!contract;

  const result = useSWR(
    shouldFetch ? ["Packages"] : null,
    getPackages(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
