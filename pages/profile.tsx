import { Container } from "@mui/material";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Layout from "../components/Layout";
import Projects from "../components/Projects";

function Profile() {
  mixpanel.track("Page view", { page: "Profile" });
  return (
    <div>
      <Head>
        <title>MintSplit | Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <Container maxWidth="lg">
            <Projects />
          </Container>
        </section>
      </Layout>
    </div>
  );
}

export default Profile;
