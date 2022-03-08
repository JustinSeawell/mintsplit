import { Button, Container, Link, Stack, Typography } from "@mui/material";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/Layout";

function Home() {
  mixpanel.track("Page view", { page: "Home" });
  const router = useRouter();

  // TODO: Update favicon
  return (
    <>
      <Head>
        <title>
          MintSplit | Mint Audio NFTs & Split Revenue with Collaborators
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3} alignItems="start">
              <Typography variant="h4">
                Sell Audio NFTs & Split Revenue with Collaborators
              </Typography>
              <ul>
                <li>
                  <Typography variant="subtitle1" textAlign={"left"}>
                    Sell Audio NFTs
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" textAlign={"left"}>
                    Split mint & royalty revenue
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" textAlign={"left"}>
                    Own your smart contracts
                  </Typography>
                </li>
              </ul>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ padding: "1rem 1.5rem" }}
                onClick={() => router.push("/setup")}
              >
                Start Creating
              </Button>
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default Home;
