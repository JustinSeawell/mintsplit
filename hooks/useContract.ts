import { Contract } from "@ethersproject/contracts";
import {
  JsonRpcProvider,
  Provider,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { NetworkConnector } from "@web3-react/network-connector";
import { useEffect, useMemo, useState } from "react";
import { useProvider } from "../contexts/NetworkProvider";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: { contractName: string; abi: any }
): T | null {
  const { library, account, chainId } = useWeb3React<Web3Provider>();
  const { provider } = useProvider();
  const { abi } = ABI;

  return useMemo(() => {
    if (!address || !abi || !library || !chainId || (!account && !provider)) {
      return null;
    }

    try {
      return new Contract(
        address,
        abi,
        account ? library.getSigner(account) : provider
      );
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, abi, library, chainId, account, provider]) as T;
}
