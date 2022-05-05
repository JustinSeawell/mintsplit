import useSWR from "swr";
import { MintSplitERC721 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useNFTContract from "./useNFTContract";

function getBalance(contract: MintSplitERC721, account: string) {
  return async (_: string, address: string) => {
    const balance = await contract.balance(account);

    return balance;
  };
}

export default function useBalance(
  contractAddress: string,
  account: string,
  suspense = false
) {
  const contract = useNFTContract(contractAddress);

  const shouldFetch =
    typeof contractAddress === "string" &&
    typeof account === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["Balance", contractAddress, account] : null,
    getBalance(contract, account),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
