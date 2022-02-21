import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import ManageRevenueSplits from "../../components/ManageRevenueSplits";
import AddressList from "../../components/ManageRevenueSplits/AddressList";
import { convertToBps } from "../../components/ManageRevenueSplits/convertToBps";
import { getTokenRanges } from "../../components/ManageRevenueSplits/getTokenRanges";
import SetupNav from "../../components/SetupNav";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { useSongs } from "../../contexts/Songs";
import { AddressListItem } from "../../types/AddressListItem";
import {
  RevenueSplit,
  RevenueSplitConfig,
} from "../../types/RevenueSplitConfig";

const MAX_MINT_PERCENTAGE = 100;
const MAX_ROYALTY_PERCENTAGE = 30;
const DEFAULT_ROYALTY_PERCENTAGE = 7;

function SetupRevenue() {
  mixpanel.track("Page view", { page: "Setup revenue" });
  const { songs } = useSongs();
  const { mintSplits, setMintSplits, royaltySplits, setRoyaltySplits } =
    useRevenueSplits();
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const tokenRanges = useMemo(() => getTokenRanges(songs), [songs]);

  // Setting here to avoid UI flicker
  const [addressListItems, setAddressListItems] = useState<AddressListItem[]>(
    isConnected ? [{ label: "You", address: account }] : []
  );

  useEffect(() => {
    if (isConnected) setAddressListItems([{ label: "You", address: account }]);
  }, [isConnected, account]);

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

  return (
    <>
      <Head>
        <title>MintSplit | Setup Revenue</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3}>
              <Typography variant="h4" gutterBottom>
                Setup Revenue Splitting
              </Typography>
              {/* Addresses */}
              <Grid container justifyContent={"center"}>
                <Grid item xs={6} pt={"2rem"}>
                  <Typography variant="h6" gutterBottom>
                    Addresses
                  </Typography>
                  <Typography variant="body1">
                    These are the Ethereum addresses that you want to split your
                    revenue with.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent={"center"}>
                <Grid item xs={8}>
                  {!isConnected && (
                    <Alert severity="warning">
                      Please connect to MetaMask to continue.
                    </Alert>
                  )}
                  {isConnected && (
                    <AddressList
                      addresses={addressListItems}
                      setAddresses={setAddressListItems}
                    />
                  )}
                </Grid>
              </Grid>
              {/* Mint Split */}
              {isConnected && (
                <Grid container justifyContent={"center"}>
                  <Grid item xs={6} pt={"4rem"} mb={"2rem"}>
                    <Typography variant="h6" gutterBottom>
                      Primary Sale (Mints)
                    </Typography>
                    <Typography variant="body1">
                      When a fan mints your NFT on MintSplit 100% of the profits
                      go to you... unless you decide to split the revenue with
                      other people.
                    </Typography>
                  </Grid>
                  <Grid container item xs={8}>
                    <ManageRevenueSplits
                      revenueSplitConfigs={mintSplits}
                      setRevenueSplitConfigs={setMintSplits}
                      requiredSplit={MAX_MINT_PERCENTAGE}
                      addressListItems={addressListItems}
                      buttonText="+ Add Mint Split"
                    />
                  </Grid>
                </Grid>
              )}
              {/* Royalty Split */}
              {isConnected && (
                <Grid container justifyContent={"center"}>
                  <Grid item xs={6} pt={"4rem"} mb={"2rem"}>
                    <Typography variant="h6" gutterBottom>
                      Secondary Sale (Royalties)
                    </Typography>
                    <Alert
                      severity="warning"
                      sx={{ textAlign: "left", marginBottom: "1rem" }}
                    >
                      Some secondary NFT markets will <strong>ignore</strong>{" "}
                      your royalty splitting rules! We recommend the following
                      secondary markets:
                      <Grid container mt={"1rem"}>
                        <Button
                          variant="outlined"
                          color="warning"
                          href="https://zora.co"
                          size="small"
                          target={"_blank"}
                          sx={{ marginRight: ".75rem" }}
                        >
                          Zora
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          href="https://rarible.com"
                          size="small"
                          target={"_blank"}
                        >
                          Rarible
                        </Button>
                      </Grid>
                    </Alert>
                    <Typography variant="body1">
                      When a fan purchases your NFT on a secondary market you
                      can take a percent of royalties on that sale. Be careful!
                      You&apos;re taking a cut of your fan&apos;s sale profits,
                      so you don&apos;t want to take too much.
                    </Typography>
                  </Grid>
                  <Grid container item xs={8}>
                    <ManageRevenueSplits
                      revenueSplitConfigs={royaltySplits}
                      setRevenueSplitConfigs={setRoyaltySplits}
                      maxSplit={MAX_ROYALTY_PERCENTAGE}
                      addressListItems={addressListItems}
                      buttonText="+ Add Royalty Split"
                    />
                  </Grid>
                  <Grid container item xs={8} mt={"2rem"}>
                    <SetupNav nextRoute="/setup/review" />
                  </Grid>
                </Grid>
              )}
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default SetupRevenue;
