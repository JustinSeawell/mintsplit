import { Box, Button, Link, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

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
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
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
