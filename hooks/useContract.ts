import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: { contractName: string; abi: any }
): T | null {
  const { library, account, chainId } = useWeb3React();
  const { abi } = ABI;

  return useMemo(() => {
    if (!address || !abi || !library || !chainId) {
      return null;
    }

    try {
      return new Contract(address, abi, library.getSigner(account));
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, abi, library, account]) as T;
}
