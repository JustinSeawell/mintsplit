import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Container, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/Layout";
import ProjectCard from "../components/ProjectCard";
import useProjectsByUser from "../hooks/useProjectsByUser";

function Projects() {
  // mixpanel.track("Page view", { page: "Profile" });
  const router = useRouter();
  const { query } = router;
  const postLaunchAddr = query?.postLaunch;
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const { data: projects } = useProjectsByUser(account);

  return (
    <div>
      <Head>
        <title>MintSplit | My Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <Container maxWidth="lg">
            {!isConnected && (
              <Grid item xs={8} m={"auto"}>
                <Alert severity="warning">
                  Please connect to MetaMask to continue.
                </Alert>
              </Grid>
            )}
            {isConnected && (
              <>
                <Typography variant="h4" gutterBottom>
                  Your Projects
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Manage your MintSplit NFT projects.
                </Typography>
                {!!postLaunchAddr && (
                  <Grid item xs={8} marginX={"auto"} mt={"2rem"}>
                    <Alert severity="success" sx={{ textAlign: "left" }}>
                      <AlertTitle>Congrats!</AlertTitle>
                      Congratulations on creating your new NFT project. Use the
                      share link below to spread the word.
                    </Alert>
                  </Grid>
                )}
                <Grid container item xs={10} mt={"2rem"} marginX={"auto"}>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    size="large"
                    component="span"
                    sx={{ padding: "1rem 1.5rem" }}
                    onClick={() => router.push("/setup")}
                  >
                    Create Project
                  </LoadingButton>
                </Grid>

                <Grid container marginX={"auto"} justifyContent={"center"}>
                  <Grid container item xs={10} spacing={3} mt={"1rem"}>
                    {projects &&
                      projects.map((project, index) => (
                        <Grid key={index} item xs={12} md={6} xl={4}>
                          <ProjectCard address={project} />
                        </Grid>
                      ))}
                    {!projects && (
                      <Typography variant="subtitle1" gutterBottom>
                        We couldn&apos;t find any mintsplit projects for this
                        address. Create a project to get started!
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        </section>
      </Layout>
    </div>
  );
}

export default Projects;
