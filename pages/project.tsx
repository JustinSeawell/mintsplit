import { Alert, CircularProgress, Container, Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import ManageContent from "../components/ManageContent";
import ManageRevenueSplits from "../components/ManageRevenueSplits";
import ProjectOverview from "../components/ProjectOverview";
import TabLayout from "../components/TabLayout";
import useCollectionData from "../hooks/useCollectionData";
import useETHBalance from "../hooks/useETHBalance";
import useNFTContract from "../hooks/useNFTContract";
import ProjectSettings from "../components/ProjectSettings";
import useBalance from "../hooks/useBalance";

const TABS = ["Project", "Revenue Splits", "Content", "Settings"];

function Project() {
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const router = useRouter();
  const { cid, t } = router.query;
  const contractAddress = cid as string;
  const startTab = parseInt(t as string);
  const validStartTab = !isNaN(startTab) && startTab < TABS.length - 1;
  const [tab, setTab] = useState(0);
  const contract = useNFTContract(contractAddress);
  const { data: collectionData } = useCollectionData(contractAddress);
  const { data: balance } = useETHBalance(contractAddress);
  const { data: userBalance } = useBalance(contractAddress, account);

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  useEffect(() => {
    if (validStartTab) setTab(startTab);
  }, [startTab, validStartTab]);

  if (!isConnected)
    return (
      <>
        <TabLayout
          title={collectionData?.params?.name}
          tabs={TABS}
          selected={tab}
          handleChange={handleChange}
        >
          <Grid item xs={6} m={"auto"} pt={"2rem"}>
            <Alert severity="warning">
              Please connect to MetaMask to continue.
            </Alert>
          </Grid>
        </TabLayout>
      </>
    );

  return (
    <>
      <TabLayout
        title={collectionData?.params?.name}
        tabs={TABS}
        selected={tab}
        handleChange={handleChange}
      >
        <section>
          {!collectionData && (
            <Container maxWidth="lg">
              <CircularProgress />
            </Container>
          )}
          {collectionData && (
            <Grid
              container
              marginX={"auto"}
              item
              p={"1rem 0"}
              xs={12}
              textAlign="left"
            >
              {tab == 0 && (
                <ProjectOverview
                  contract={contract}
                  account={account}
                  ownerAddress={collectionData?.owner}
                  name={collectionData?.params?.name}
                  symbol={collectionData?.params?.symbol}
                  editions={collectionData?.editions}
                  totalEditions={collectionData?.totalEditions}
                  tokens={collectionData?.tokens}
                  balance={balance}
                  totalBalance={collectionData?.totalBalance}
                  userBalance={userBalance}
                  setTab={setTab}
                />
              )}
              {tab == 1 && (
                <ManageRevenueSplits
                  contractAddress={contractAddress}
                  ownerAddress={collectionData?.owner}
                  editions={collectionData?.editions}
                />
              )}
              {tab == 2 && (
                <ManageContent
                  contractAddress={contractAddress}
                  baseURI={collectionData?.params?.baseURI}
                  editions={collectionData?.editions}
                />
              )}
              {tab == 3 && (
                <ProjectSettings
                  contractAddress={contractAddress}
                  params={collectionData?.params}
                  isPaused={collectionData?.isPaused}
                />
              )}
            </Grid>
          )}
        </section>
      </TabLayout>
    </>
  );
}

export default Project;
