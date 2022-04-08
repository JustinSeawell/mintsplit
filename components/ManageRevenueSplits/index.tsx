import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { PaymentSplitConfigStruct } from "../../contracts/types/RevenueSplitter";
import useRevenueData from "../../hooks/useRevenueData";
import Addresses from "./Addresses";
import MintSplits from "./MintSplits";

interface ManageRevenueSplitProps {
  hasSplitter: boolean;
  revenueSplitter: string;
  addingSplits: boolean;
  setAddingSplits: (state: boolean) => void;
}

/**
 * TODO:
 * - pull existing revenue split data from blockchain
 * - display on UI
 * - handle updates
 * - post updates
 */
function ManageRevenueSplits({
  hasSplitter,
  revenueSplitter,
  addingSplits,
  setAddingSplits,
}: ManageRevenueSplitProps) {
  const { account, library } = useWeb3React();
  const { data: revenueData } = useRevenueData(revenueSplitter, account);
  const { mintSplits, setMintSplits, royaltySplits, setRoyaltySplits } =
    useRevenueSplits();
  const isConnected = typeof account === "string" && !!library;

  useEffect(() => {
    if (hasSplitter || !addingSplits) return;

    const defaultMintSplit = {
      contentId: 0,
      isMint: true,
      split: {
        recipients: [account],
        bps: [BigNumber.from(10000)],
      },
    } as PaymentSplitConfigStruct;

    setMintSplits([defaultMintSplit]);

    const defaultRoyaltySplit = {
      contentId: 0,
      isMint: false,
      split: {
        recipients: [account],
        bps: [BigNumber.from(1100)],
      },
    } as PaymentSplitConfigStruct;

    setRoyaltySplits([defaultRoyaltySplit]);
  }, [account, addingSplits, hasSplitter, setMintSplits, setRoyaltySplits]);

  if (!isConnected)
    return (
      <Grid item xs={6} m={"auto"}>
        <Alert severity="warning">
          Please connect to MetaMask to continue.
        </Alert>
      </Grid>
    );

  if (!hasSplitter && !addingSplits) {
    return (
      <Grid item xs={8} marginX={"auto"} textAlign={"center"}>
        <Stack spacing={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Add Splits
              </Typography>
              <Typography variant="body1" gutterBottom>
                100% of your NFT sale revenue is going to you. Click the button
                below to split it with your collaborators.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => setAddingSplits(true)}
              >
                Split Revenue
              </LoadingButton>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} marginX={"auto"} textAlign={"center"}>
      <Stack spacing={8}>
        <Addresses />
        <MintSplits splitConfigs={mintSplits} />
      </Stack>
    </Grid>
  );
}

export default ManageRevenueSplits;
