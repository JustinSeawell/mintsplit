import { Contract } from "@ethersproject/contracts";
import {
  JsonRpcProvider,
  Provider,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: { contractName: string; abi: any }
): T | null {
  const { account, chainId, provider } = useWeb3React();
  const { abi } = ABI;

  return useMemo(() => {
    if (!address || !abi || !chainId || !provider) {
      return null;
    }

    try {
      return new Contract(
        address,
        abi,
        !!account ? provider.getSigner(account) : provider
      );
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [abi, account, address, chainId, provider]) as T;
}
