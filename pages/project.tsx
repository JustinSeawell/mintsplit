import {
  CircularProgress,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import ManageRevenueSplits from "../components/ManageRevenueSplits";
import ProjectOverview from "../components/ProjectOverview";
import useCollectionData from "../hooks/useCollectionData";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

function Project() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [addingSplits, setAddingSplits] = useState(false);
  const { cid } = router.query;
  const contractAddress = cid as string;
  const { data: collectionData } = useCollectionData(contractAddress);
  const { name, revenueSplitter } = {
    ...collectionData,
  };
  const hasSplitter = revenueSplitter != EMPTY_ADDRESS;

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <>
      <Head>
        <title>MintSplit | {name ?? "Project"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          {!collectionData && (
            <Container maxWidth="lg">
              <CircularProgress />
            </Container>
          )}
          {collectionData && (
            <Container maxWidth="lg" sx={{ textAlign: "left" }}>
              <Grid
                container
                marginX={"auto"}
                justifyContent={"center"}
                item
                xs={12}
              >
                {/* <Grid container item spacing={4}> */}
                <Grid container item xs={12}>
                  <Tabs value={tab} onChange={handleChange}>
                    <Tab label="Project" />
                    <Tab label="Revenue Splits" />
                    <Tab label="Content" />
                    <Tab label="Settings" />
                  </Tabs>
                  <Divider sx={{ width: "100%" }} />
                </Grid>
                {/* {tab == 0 && (
                    <ProjectOverview
                      collectionData={collectionData}
                      hasSplitter={hasSplitter}
                      setTab={setTab}
                    />
                  )} */}
                {/* {tab == 1 && (
                    <ManageRevenueSplits
                      hasSplitter={hasSplitter}
                      revenueSplitter={revenueSplitter}
                      addingSplits={addingSplits}
                      setAddingSplits={setAddingSplits}
                    />
                  )} */}
                {/* {tab == 2 && <div>Content</div>} */}
                {/* </Grid> */}
              </Grid>
            </Container>
          )}
        </section>
      </Layout>
    </>
  );
}

export default Project;
