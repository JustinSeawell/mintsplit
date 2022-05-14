import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { network } from "../connectors";

export default function useNetworkConnection() {
  const { account, library, activate, active, connector } = useWeb3React();
  console.log("activate network", account, library, active);

  useEffect(() => {
    if (!account && !library && !active) {
      activate(network).catch((err) => {
        console.error(err);
      });
    }
  }, [account, activate, active, library]);
}
