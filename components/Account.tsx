import { Box, Button, Link, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { metaMask } from "../connectors/metaMask";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { isActive, error, chainId, account, ENSName } = useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (isActive || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [error, isActive, stopOnboarding]);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <Button
            variant="outlined"
            color="secondary"
            disabled={connecting}
            onClick={async () => {
              setConnecting(true);
              await metaMask.connectEagerly();
              metaMask.activate(chainId);
            }}
          >
            <Typography fontWeight={300} fontSize={".8rem"}>
              {isMetaMaskInstalled
                ? "Connect to MetaMask"
                : "Connect to Wallet"}
            </Typography>
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={startOnboarding}
          >
            <Typography fontWeight={300} fontSize={".8rem"}>
              Install Metamask
            </Typography>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Link href="/projects" style={{ textDecoration: "none" }}>
      <Button variant="outlined" color="secondary">
        <Typography
          fontWeight={300}
          fontSize={".8rem"}
          sx={{ textDecoration: "none" }}
        >
          {ENSName || `${shortenHex(account, 4)}`}
        </Typography>
      </Button>
    </Link>
  );
};

export default Account;
