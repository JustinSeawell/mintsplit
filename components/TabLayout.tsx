import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import Footer from "./Footer";
import TabNavbar from "./TabNavbar";

const Main = styled("main")({
  minHeight: "calc(100vh - 113px - 100px);", // TODO: Perfect this
  textAlign: "center",
});

interface LayoutProps {
  title?: string;
  tabs: string[];
  selected: number;
  handleChange: (event: React.SyntheticEvent, newTab: number) => void;
  children: any;
}

export default function TabLayout({
  title,
  tabs,
  selected,
  handleChange,
  children,
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ""}MintSplit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TabNavbar tabs={tabs} selected={selected} handleChange={handleChange} />
      <Main>
        <Container maxWidth="lg">{children}</Container>
      </Main>
      <Footer />
    </>
  );
}
