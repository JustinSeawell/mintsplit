import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import ElevationScroll from "./ElevationScroll";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Main = styled("main")({
  minHeight: "calc(100vh - 64px - 100px);", // TODO: Perfect this
  textAlign: "center",
});

interface LayoutProps {
  title?: string;
  children: any;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ""}MintSplit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Main>
        <Container maxWidth="lg">{children}</Container>
      </Main>
      <Footer />
    </>
  );
}
