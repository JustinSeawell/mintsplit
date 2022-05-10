import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Container, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/Layout";
import ProjectCard from "../components/ProjectCard";
import useProjectsByUser from "../hooks/useProjectsByUser";

function Projects() {
  const router = useRouter();
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const { data: projects } = useProjectsByUser(account);

  return (
    <>
      <Layout title="My Projects">
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
                  Manage your audio NFT projects.
                </Typography>
                <Grid container item xs={10} marginY={"2rem"} marginX={"auto"}>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    component="span"
                    size="large"
                    onClick={() => router.push("/setup")}
                  >
                    Create Project
                  </LoadingButton>
                </Grid>
                <Grid container marginX={"auto"} justifyContent={"center"}>
                  <Grid container item xs={10} spacing={2}>
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
    </>
  );
}

export default Projects;
