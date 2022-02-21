import { Container, Stack } from "@mui/material";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Layout from "../components/Layout";
import UploadAudio from "../components/UploadAudio";

function Home() {
  mixpanel.track("Page view", { page: "Home" });

  return (
    <>
      <Head>
        <title>MintSplit | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3} alignItems="center">
              <UploadAudio />
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default Home;
