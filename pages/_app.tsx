import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import mixpanel from "mixpanel-browser";

function NextWeb3App({ Component, pageProps }: AppProps) {
  mixpanel.init("7af5377299121b8ba439ef16a454b949", { debug: true }); // TODO: Set debug by env

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
