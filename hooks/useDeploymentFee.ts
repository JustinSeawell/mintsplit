import useSWR from "swr";
import { AudioNFTFactory } from "../contracts/types";
import useAudioNFTFactoryContract from "./useAudioNFTFactoryContract";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getDeploymentFee(contract: AudioNFTFactory) {
  return async (_: string, address: string) => {
    const deploymentFee = await contract.deploymentFee();

    return deploymentFee;
  };
}

export default function useDeploymentFee(address: string, suspense = false) {
  const contract = useAudioNFTFactoryContract(address);

  const shouldFetch = typeof address === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["DeploymentFee", address] : null,
    getDeploymentFee(contract),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
