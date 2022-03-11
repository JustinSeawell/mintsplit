import { formatEther } from "@ethersproject/units";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/Layout";
import useCollectionData from "../hooks/useCollectionData";
import useRevenueData from "../hooks/useRevenueData";
import useRevenueSplitter from "../hooks/useRevenueSplitter";
import { formatEtherscanLink } from "../util";

function Project() {
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const { account } = useWeb3React();
  const { data: collectionData } = useCollectionData(contractAddress);
  const { name, revenueSplitterAddr } = { ...collectionData };
  const revenueSplitter = useRevenueSplitter(revenueSplitterAddr);
  const { data: revenueData } = useRevenueData(revenueSplitterAddr, account);
  const { totalBalance, userBalance } = { ...revenueData };

  const withdrawFunds = async () => {
    await revenueSplitter.release(account, { from: account });
  };

  return (
    <>
      <Head>
        <title>MintSplit | {name ?? "Project"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <Container maxWidth="lg" sx={{ textAlign: "left" }}>
            <Typography variant="h4" gutterBottom>
              {name}
            </Typography>
            <Grid sx={{ mb: "1rem" }}>
              <Link
                href={formatEtherscanLink("Account", [4, contractAddress])}
                target={"_blank"}
              >
                View On Etherscan
              </Link>
            </Grid>
            <Grid container marginX={"auto"} justifyContent={"center"}>
              <Grid container item spacing={3}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2">Your Balance</Typography>
                      <Typography variant="h2">
                        {formatEther(userBalance ?? 0)} Ξ
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={withdrawFunds}
                      >
                        Withdraw
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent sx={{ height: "100%" }}>
                      <Typography variant="subtitle2">Total Balance</Typography>
                      <Grid
                        container
                        justifyContent={"center"}
                        alignItems={"center"}
                        height={"100%"}
                      >
                        <Typography variant="h2" fontSize={"3rem"}>
                          {formatEther(totalBalance ?? 0)} Ξ
                        </Typography>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </section>
      </Layout>
    </>
  );
}

export default Project;
