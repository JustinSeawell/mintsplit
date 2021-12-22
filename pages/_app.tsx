import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import getLibrary from "../getLibrary";
import "../styles/globals.css";

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
