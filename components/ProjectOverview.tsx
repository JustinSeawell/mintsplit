import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { MintSplitERC721 } from "../contracts/types";
import theme from "../theme";
import { formatEtherscanLink } from "../util";

interface ProjectOverviewProps {
  contract: MintSplitERC721;
  account: string;
  ownerAddress: string;
  name: string;
  symbol: string;
  editions: BigNumber[];
  totalEditions: BigNumber;
  totalBalance: BigNumber;
  tokens: BigNumber;
  balance: BigNumber;
  userBalance: BigNumber;
  setTab: (tab: number) => void;
}

function ProjectOverview({
  contract,
  account,
  ownerAddress,
  name,
  symbol,
  editions,
  totalEditions,
  totalBalance,
  tokens,
  balance,
  userBalance,
  setTab,
}: ProjectOverviewProps) {
  const router = useRouter();
  const { cid, welcome } = router.query;
  const contractAddress = cid as string;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const isOwner = account == ownerAddress;
  const userBalanceDisplay = isOwner ? balance?.sub(totalBalance) : userBalance;
  const isBalance = userBalanceDisplay?.gt(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      let trx;
      if (isOwner) {
        trx = await contract.withdraw({ from: account });
      } else {
        trx = await contract.release(account, { from: account });
      }
      await trx.wait();
    } catch (err) {}
    setLoading(false);
  };

  return (
    <>
      <Grid container spacing={2} mb={"1rem"}>
        <Grid item xs>
          <Card
            sx={{
              backgroundColor: theme.palette.grey[100],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h2" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body2">({symbol})</Typography>
              <Link
                href={formatEtherscanLink("Account", [4, contractAddress])}
                target={"_blank"}
              >
                <Typography variant="body2">{contractAddress}</Typography>
              </Link>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() =>
                  router.push(`/collection?cid=${contractAddress}`)
                }
              >
                View
              </Button>
              <Button
                size="small"
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
            </CardActions>
          </Card>
        </Grid>
        {welcome == "1" && (
          <Grid item xs={4}>
            <Alert
              severity="success"
              sx={{
                lineHeight: "1.5rem",
                height: "100%",
                textAlign: "center",
              }}
              icon={false}
            >
              <AlertTitle>Welcome!</AlertTitle>
              Congratulations on launching your NFT project. On this page you
              will find the tools for managing your project details, revenue
              splits, and more.
            </Alert>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.grey[100],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Progress
              </Typography>
              <Typography variant="body2" gutterBottom>
                {tokens?.toNumber()} / {totalEditions?.toNumber()} NFTs have
                been minted.{" "}
                {balance &&
                  `The contract balance is: ${formatEther(balance)} Eth.`}{" "}
                {userBalance &&
                  `Your balance is: ${formatEther(userBalanceDisplay)} Eth.`}
              </Typography>
            </CardContent>
            <CardActions>
              <LoadingButton
                loading={loading}
                disabled={!isBalance}
                onClick={handleClick}
              >
                Withdraw Revenue
              </LoadingButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.grey[100],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Splits
              </Typography>
              <Typography variant="body2" gutterBottom>
                Share some revenue with your collaborators!
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => setTab(1)}>Add Splits</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.grey[100],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Content
              </Typography>
              <Typography variant="body2" gutterBottom>
                You have {editions.length} piece{editions.length > 1 ? "s" : ""}{" "}
                of content in your project. Send more content to the blockchain!
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => setTab(2)}>Add Content</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ProjectOverview;
