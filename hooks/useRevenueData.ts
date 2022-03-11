import useSWR from "swr";
import { RevenueSplitter } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useRevenueSplitter from "./useRevenueSplitter";

function getRevenueData(contract: RevenueSplitter, userAddress: string) {
  return async (_: string, address: string) => {
    const [totalBalance, userBalance] = await Promise.all([
      await contract.totalBalance(),
      await contract.balance(userAddress),
    ]);

    return { totalBalance, userBalance };
  };
}

export default function useRevenueData(
  contractAddress: string,
  userAddress: string,
  suspense = false
) {
  const contract = useRevenueSplitter(contractAddress);

  const shouldFetch =
    typeof contractAddress === "string" &&
    typeof userAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["RevenueData", contractAddress, userAddress] : null,
    getRevenueData(contract, userAddress),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
