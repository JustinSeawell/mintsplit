import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const RPC_URLS: { [chainId: number]: string } = {
  4: process.env.NEXT_PUBLIC_RPC_URL_4 as string,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

// TODO: Update with mainnet infura node URL
export const network = new NetworkConnector({
  urls: { 4: RPC_URLS[4] },
  defaultChainId: 4,
});
