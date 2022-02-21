import { Container, Grid, Stack, Typography } from "@mui/material";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Layout from "../../components/Layout";
import ManageSongs from "../../components/ManageSongs";
import SetupNav from "../../components/SetupNav";

function SetupNFTs() {
  mixpanel.track("Page view", { page: "Setup NFTs" });

  return (
    <>
      <Head>
        <title>MintSplit | Setup NFTs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4">Setup Your NFTs</Typography>
              <Typography variant="body1">
                Add info about your songs, so that your fans know what they are
                buying.
              </Typography>
              <Grid container item xs={8} spacing={2}>
                <ManageSongs />
              </Grid>
              <Grid container item xs={8}>
                <SetupNav nextRoute="/setup/project" backText="Start Over" />
              </Grid>
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default SetupNFTs;
