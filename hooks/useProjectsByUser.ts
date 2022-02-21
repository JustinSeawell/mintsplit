import useSWR from "swr";
import { AudioNFTFactory } from "../contracts/types";
import useAudioNFTFactoryContract from "./useAudioNFTFactoryContract";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getProjectsByUser(contract: AudioNFTFactory, userAddress: string) {
  return async (_: string, address: string) => {
    const userProjects = await contract.getProjectsByUser(userAddress);

    return userProjects;
  };
}

export default function useProjectsByUser(
  contractAddress: string,
  userAddress: string,
  suspense = false
) {
  const contract = useAudioNFTFactoryContract(contractAddress);

  const shouldFetch = typeof contractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["ProjectsByUser", contractAddress, userAddress] : null,
    getProjectsByUser(contract, userAddress),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
