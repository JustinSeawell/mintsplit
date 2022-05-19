import type { AppProps } from "next/app";
import "../styles/globals.css";
import mixpanel from "mixpanel-browser";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { SongsProvider } from "../contexts/Songs";
import { ProjectProvider } from "../contexts/Project";

import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import { hooks as networkHooks, network } from "../connectors/network";

const connectors: [MetaMask | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [network, networkHooks],
];

function NextWeb3App({ Component, pageProps }: AppProps) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "prod") {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_ID);
  }

  return (
    <Web3ReactProvider connectors={connectors}>
      <ThemeProvider theme={theme}>
        <SongsProvider>
          <ProjectProvider>
            <Component {...pageProps} />
          </ProjectProvider>
        </SongsProvider>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
