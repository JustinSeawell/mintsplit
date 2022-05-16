import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";

function getBlockNumber(provider: Web3Provider) {
  return async () => {
    return provider.blockNumber;
  };
}

export default function useBlockNumber() {
  const { provider, isActive } = useWeb3React();
  const shouldFetch = !!isActive;

  return useSWR(
    shouldFetch ? ["BlockNumber"] : null,
    getBlockNumber(provider),
    {
      refreshInterval: 10 * 1000,
    }
  );
}
