import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { useSongs } from "../../contexts/Songs";
import { AddressListItem } from "../../types/AddressListItem";
import {
  RevenueSplit,
  RevenueSplitConfig,
} from "../../types/RevenueSplitConfig";
import { convertToBps } from "./convertToBps";
import { getTokenRanges } from "./getTokenRanges";
import Addresses from "./Addresses";
import { DEFAULT_ROYALTY_PERCENTAGE, MAX_MINT_PERCENTAGE } from "./config";
import MintSplits from "./MintSplits";
import RoyaltySplits from "./RoyaltySplits";
import SetupNav from "../SetupNav";

interface ManageRevenueSplitProps {
  onSuccess: () => void;
  handleBack: () => void;
}

function ManageRevenueSplits({
  onSuccess,
  handleBack,
}: ManageRevenueSplitProps) {
  const { mintSplits, setMintSplits, royaltySplits, setRoyaltySplits } =
    useRevenueSplits();
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const { songs } = useSongs();
  const tokenRanges = useMemo(() => getTokenRanges(songs), [songs]);

  const defaultAddrListItem = useMemo(
    () =>
      ({
        label: "You",
        address: account,
      } as AddressListItem),
    [account]
  );

  // Setting here to avoid UI flicker
  const [addressListItems, setAddressListItems] = useState<AddressListItem[]>(
    isConnected ? [defaultAddrListItem] : []
  );

  useEffect(() => {
    if (isConnected) setAddressListItems([defaultAddrListItem]);
  }, [defaultAddrListItem, isConnected]);

  useEffect(() => {
    // on first render, add a 100% artist MINT split for each song
    if (!account) return;

    const defaultSplit = {
      recipient: account, // artist
      bps: convertToBps(MAX_MINT_PERCENTAGE),
    } as RevenueSplit;

    const splits = tokenRanges.map(
      (tokenRange) =>
        ({ tokenRange, splits: [defaultSplit] } as RevenueSplitConfig)
    );

    setMintSplits(splits);
  }, [account, setMintSplits, tokenRanges]);

  useEffect(() => {
    // on first render, add a 10% artist ROYALTY split for each song
    if (!account) return;

    const defaultSplit = {
      recipient: account, // artist
      bps: convertToBps(DEFAULT_ROYALTY_PERCENTAGE),
    } as RevenueSplit;

    const splits = tokenRanges.map(
      (tokenRange) =>
        ({ tokenRange, splits: [defaultSplit] } as RevenueSplitConfig)
    );

    setRoyaltySplits(splits);
  }, [account, setRoyaltySplits, tokenRanges]);

  if (!isConnected)
    return (
      <Grid item xs={8} m={"auto"}>
        <Alert severity="warning">
          Please connect to MetaMask to continue.
        </Alert>
      </Grid>
    );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Split Revenue
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Split revenue from mints and royalties.
      </Typography>
      <Stack spacing={12} mt={"3rem"}>
        <Grid container justifyContent={"center"}>
          <Addresses
            addressListItems={addressListItems}
            setAddressListItems={setAddressListItems}
          />
        </Grid>
        <Grid container justifyContent={"center"}>
          <MintSplits
            revenueSplitConfigs={mintSplits}
            setRevenueSplitConfigs={setMintSplits}
            addressListItems={addressListItems}
          />
        </Grid>
        <Grid container justifyContent={"center"}>
          <RoyaltySplits
            revenueSplitConfigs={royaltySplits}
            setRevenueSplitConfigs={setRoyaltySplits}
            addressListItems={addressListItems}
          />
        </Grid>
      </Stack>
      <Grid item xs={10} mt={"2rem"} marginX={"auto"}>
        <SetupNav handleNext={onSuccess} handleBack={handleBack} />
      </Grid>
    </>
  );
}

export default ManageRevenueSplits;
