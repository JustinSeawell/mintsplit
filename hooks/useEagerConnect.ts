import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { network } from "../connectors/network";
import { metaMask } from "../connectors/metaMask";

export default function useEagerConnect() {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
  const { isActive } = useWeb3React();
  const [triedMetaMask, setTriedMetaMask] = useState(false);
  const [triedNetwork, setTriedNetwork] = useState(false);
  const tried = triedMetaMask && triedNetwork;

  useEffect(() => {
    const attemptConnectToMM = async () => {
      await metaMask.connectEagerly();
      metaMask.activate(chainId);
      setTriedMetaMask(true);
    };
    if (!isActive && !triedMetaMask) attemptConnectToMM();
  }, [chainId, isActive, triedMetaMask]);

  useEffect(() => {
    const attemptConnectToNetwork = async () => {
      await network.activate(chainId);
      setTriedNetwork(true);
    };
    if (!isActive && triedMetaMask && !triedNetwork) attemptConnectToNetwork();
  }, [chainId, isActive, triedMetaMask, triedNetwork]);

  useEffect(() => {
    if (!tried && isActive) {
      setTriedMetaMask(true);
      setTriedNetwork(true);
    }
  }, [isActive, tried]);

  return tried;
}
