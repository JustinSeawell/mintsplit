import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { NetworkConnector } from "@web3-react/network-connector";
import { createContext, useContext, useEffect, useState } from "react";
import useNetworkConnection from "../hooks/useNetworkConnection";
import { NETWORK_NAMES } from "../util";

interface NetworkProviderContextValue {
  provider?: JsonRpcProvider;
}

const defaultValue = {
  provider: null,
} as NetworkProviderContextValue;

const NetworkProviderContext =
  createContext<NetworkProviderContextValue>(defaultValue);

const getProvider = async (connector: NetworkConnector) => {
  const { url } = await connector.getProvider();
  return new JsonRpcProvider(url, {
    name: NETWORK_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID],
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
  });
};

export const NetworkProviderProvider = ({ children }) => {
  const { account, connector } = useWeb3React<Web3Provider>();
  const [provider, setProvider] = useState<JsonRpcProvider>(null);
  console.log("activate network", account, connector, provider);
  useNetworkConnection();

  useEffect(() => {
    if (account || !connector) return;

    const fetchAndSetProvider = async () => {
      const provider = await getProvider(connector as NetworkConnector);
      setProvider(provider);
    };

    fetchAndSetProvider();
  }, [account, connector]);

  return (
    <NetworkProviderContext.Provider
      value={{ provider } as NetworkProviderContextValue}
    >
      {children}
    </NetworkProviderContext.Provider>
  );
};

export const useProvider = () => useContext(NetworkProviderContext);
