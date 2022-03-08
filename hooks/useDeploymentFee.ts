import useSWR from "swr";
import { MintSplitFactoryV1 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMintSplitFactory from "./useMintSplitFactory";

function getDeploymentFee(contract: MintSplitFactoryV1) {
  return async (_: string, address: string) => {
    const deploymentFee = await contract.deploymentFee();

    return deploymentFee;
  };
}

export default function useDeploymentFee(suspense = false) {
  const contract = useMintSplitFactory();

  const shouldFetch = typeof !!contract;

  const result = useSWR(
    shouldFetch ? ["DeploymentFee", contract] : null,
    getDeploymentFee(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
