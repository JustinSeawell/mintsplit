import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import mixpanel from "mixpanel-browser";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { SongsProvider } from "../contexts/Songs";
import { ProjectProvider } from "../contexts/Project";
import { NetworkProviderProvider } from "../contexts/NetworkProvider";

function NextWeb3App({ Component, pageProps }: AppProps) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_ID, {
    debug: process.env.NEXT_PUBLIC_ENVIRONMENT != "prod",
  });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProviderProvider>
        <ThemeProvider theme={theme}>
          <SongsProvider>
            <ProjectProvider>
              <Component {...pageProps} />
            </ProjectProvider>
          </SongsProvider>
        </ThemeProvider>
      </NetworkProviderProvider>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
