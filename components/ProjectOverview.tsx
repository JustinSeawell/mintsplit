import { formatEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  Link,
  Stack,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import useCollectionData from "../hooks/useCollectionData";
import useETHBalance from "../hooks/useETHBalance";
import useNFTContract from "../hooks/useNFTContract";
import { Collection } from "../types/Collection";
import { formatEtherscanLink } from "../util";

interface ProjectOverviewProps {
  collectionData: Collection;
  hasSplitter: boolean;
  setTab: (tab: number) => void;
}

function ProjectOverview({
  collectionData,
  hasSplitter,
  setTab,
}: ProjectOverviewProps) {
  const router = useRouter();
  const { cid, welcome } = router.query;
  const contractAddress = cid as string;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const contract = useNFTContract(contractAddress);
  const { data: balance } = useETHBalance(contractAddress);
  const { name, symbol, totalSupply, totalSupplyLimit, contentCount } = {
    ...collectionData,
  };

  return (
    <>
      <Grid container item xs={12} sx={{ mb: "1rem" }}>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <Grid item>
              <Typography variant="h3">{name}</Typography>
              <Typography variant="body2" gutterBottom>
                ({symbol})
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Contract Address:</Typography>
              <Link
                href={formatEtherscanLink("Account", [4, contractAddress])}
                target={"_blank"}
              >
                <Typography variant="body2">{contractAddress}</Typography>
              </Link>
            </Grid>
            <Grid container item xs={6}>
              <Button
                variant="outlined"
                sx={{ mr: ".75rem" }}
                onClick={() =>
                  router.push(`/collection?cid=${contractAddress}`)
                }
              >
                View
              </Button>
              <Button
                variant="outlined"
                sx={{ mr: ".75rem" }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.host}/collection?cid=${contractAddress}`
                  );
                  setSnackbarOpen(true);
                }}
              >
                Share
              </Button>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                message="Link Copied"
                onClose={() => setSnackbarOpen(false)}
              />
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs>
          {welcome == "1" && (
            <Alert severity="success" sx={{ lineHeight: "1.5rem" }}>
              <AlertTitle>Welcome!</AlertTitle>
              Congratulations on launching your NFT project. On this page you
              will find the tools for managing your project details, revenue
              splits, and more.
            </Alert>
          )}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={1}>
          <Typography variant="h5">Revenue</Typography>
          <Grid container item>
            <Grid container item spacing={2}>
              <Grid item xs>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Balance</Typography>
                    <Typography variant="h4" gutterBottom>
                      {formatEther(balance?.toNumber() ?? 0)} Ξ
                    </Typography>
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      size="medium"
                      onClick={async () => await contract.withdraw()}
                      disabled={balance?.toNumber() == 0}
                    >
                      Withdraw
                    </LoadingButton>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Splits
                    </Typography>
                    <Typography variant="body2">
                      {hasSplitter
                        ? "You're splitting revenue with collaborators."
                        : "100% of your NFT sale revenue is going to you."}
                    </Typography>
                    <br />
                    <LoadingButton
                      variant="outlined"
                      color="secondary"
                      size="medium"
                      onClick={() => setTab(1)}
                    >
                      {hasSplitter ? "Manage Splits" : "Split Revenue"}
                    </LoadingButton>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={1}>
          <Typography variant="h5">Progress</Typography>
          <Grid container item>
            <Grid container item spacing={2}>
              <Grid item xs>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Minted</Typography>
                    <Typography variant="h5">
                      {`${totalSupply?.toNumber()} / ${totalSupplyLimit?.toNumber()}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Space</Typography>
                    <Typography variant="h5">{`${totalSupplyLimit?.toNumber()} / ${2000}`}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={1}>
          <Typography variant="h5">Content</Typography>
          <Grid container item>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      Pieces of Content
                    </Typography>
                    <Typography variant="h5">
                      {contentCount?.toNumber()}
                    </Typography>
                    <br />
                    <LoadingButton
                      variant="outlined"
                      color="secondary"
                      size="medium"
                      onClick={() => setTab(2)}
                    >
                      Manage Content
                    </LoadingButton>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
    </>
  );
}

export default ProjectOverview;
