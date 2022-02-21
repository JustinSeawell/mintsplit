import { Container, Grid, Stack, Typography } from "@mui/material";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Layout from "../../components/Layout";
import ManageProject from "../../components/ManageProject";
import SetupNav from "../../components/SetupNav";

function SetupProject() {
  mixpanel.track("Page view", { page: "Setup Project" });

  return (
    <>
      <Head>
        <title>MintSplit | Setup Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4">Tell Us About Your Project</Typography>
              <Typography variant="body1">
                Add details about your project like the name and the mint price.
              </Typography>
              <Grid container xs={8}>
                <ManageProject />
              </Grid>
              <Grid container xs={8}>
                <SetupNav nextRoute="/setup/revenue" />
              </Grid>
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default SetupProject;
