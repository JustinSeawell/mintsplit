import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { NetworkConnector } from "@web3-react/network-connector";
import { createContext, useContext, useEffect, useState } from "react";
import useNetworkConnection from "../hooks/useNetworkConnection";

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
  return new JsonRpcProvider(url, { name: "rinkeby", chainId: 4 }); // TODO: Update this to all chains
};

export const NetworkProviderProvider = ({ children }) => {
  const { account, connector } = useWeb3React<Web3Provider>();
  const [provider, setProvider] = useState<JsonRpcProvider>(null);
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
