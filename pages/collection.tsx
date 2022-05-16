import { formatEther, parseEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { isAfter } from "date-fns";
import { BigNumber } from "ethers";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import Layout from "../components/Layout";
import NFTCard from "../components/NFTCard";
import useCollectionData from "../hooks/useCollectionData";
import useNFTContract from "../hooks/useNFTContract";
import { hooks, network } from "../connectors/network";

const TITLE = "Collection";
const MINT_LIMIT = 20;

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

function Collection() {
  const { account, chainId } = useWeb3React();
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const contract = useNFTContract(contractAddress);
  const { data } = useCollectionData(contractAddress);
  const { params, editions, isPaused, owner } = { ...data };
  const { name, mintPrice, releaseTime } = { ...params };
  const isOwner = account == owner;
  const [contentQty, setContentQty] = useState<Map<number, number>>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [error, setError] = useState("");
  const formattedMintPrice = mintPrice ? formatEther(mintPrice) : "";
  const totalFee = (totalAmount * parseFloat(formattedMintPrice)).toPrecision(
    3
  );

  useEffect(() => {
    if (!releaseTime) return;

    const releaseDate = new Date(releaseTime?.toNumber() * 1000);
    const now = new Date();

    setIsReleased(isAfter(now, releaseDate));
  }, [releaseTime]);

  const handleQtyChange = (id: number, amount: number) => {
    const newMap = new Map<number, number>(contentQty);
    isNaN(amount) ? newMap.delete(id) : newMap.set(id, amount);
    setContentQty(newMap);
  };

  useEffect(() => {
    if (!mintPrice) return;

    let newTotalAmount = 0;
    contentQty?.forEach((amount) => {
      newTotalAmount += amount;
    });

    setTotalAmount(newTotalAmount);
  }, [contentQty, mintPrice]);

  useEffect(() => {
    setError(totalAmount > MINT_LIMIT ? "Exceeded Mint Limit" : "");
  }, [totalAmount]);

  const clearSelected = () => {
    const newMap = new Map<number, number>(contentQty);
    newMap.clear();
    setContentQty(newMap);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const ids = [];
    contentQty.forEach((amount, id) => {
      ids.push(...Array(amount).fill(id));
    });

    try {
      const opts = { from: account } as { from: string; value: BigNumber };
      if (!isOwner) opts.value = parseEther(totalFee);

      const trx = await contract.mint(ids, opts);
      await trx.wait();

      setSuccess(true);
      clearSelected();
    } catch (err) {
      // TODO: Report to sentry
      setError("There was a problem when minting. Please try again later.");
    }

    setLoading(false);
    window.scrollTo(0, 0);
  };

  if (!data)
    return (
      <>
        <Layout title={TITLE}>
          <section>
            {
              <Grid marginY={"2rem"}>
                <CircularProgress size={80} />
              </Grid>
            }
          </section>
        </Layout>
      </>
    );

  return (
    <>
      <Layout title={TITLE}>
        <section>
          {success && (
            <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
              <Alert severity="success">NFT Mint Successful!</Alert>
            </Grid>
          )}
          {isPaused && (
            <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
              <Alert severity="warning">
                This Contract is paused. Minting is temporarily disabled.
              </Alert>
            </Grid>
          )}
          {isOwner && !isReleased && (
            <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
              <Alert severity="info">
                Only (you) the creator can mint before the release date.
              </Alert>
            </Grid>
          )}
          {error && (
            <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Typography variant="h2" gutterBottom fontWeight={500}>
            {name}
          </Typography>
          {releaseTime && !isReleased && (
            <CountdownTimer releaseTime={releaseTime?.toNumber()} />
          )}
          <Grid container marginX={"auto"} justifyContent={"center"}>
            <Grid container item xs={12} sm={8} md={10} xl={12} spacing={3}>
              {editions?.map((edition, index) => {
                if (edition?.isZero()) return;

                return (
                  <Grid key={`nft-card-${index}`} item xs={12} md={6} xl={4}>
                    <NFTCard
                      contractAddress={contractAddress}
                      contentId={index + 1}
                      qty={contentQty?.get(index + 1)}
                      handleQtyChange={handleQtyChange}
                      disabled={
                        (!isReleased && !isOwner) || isPaused || !account
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          {!isOwner && (
            <Grid
              item
              xs={12}
              sm={8}
              md={10}
              xl={12}
              mt={"2rem"}
              marginX={"auto"}
            >
              <Box
                textAlign={"left"}
                bgcolor={"#F5F5F5"}
                p={"1rem"}
                borderRadius={2}
                width={"100%"}
              >
                <Typography fontWeight={600} gutterBottom>
                  Total Cost
                </Typography>
                <Typography gutterBottom>
                  {totalAmount} NFTs x {formattedMintPrice} Ξ
                </Typography>
                <Typography fontSize={"1.5rem"} fontWeight={300}>
                  Total: {totalFee} Ξ (+ gas)
                </Typography>
                <Typography variant="caption">
                  This is the cost to mint your selected NFTs on the blockchain.
                </Typography>
              </Box>
            </Grid>
          )}
          {(isReleased || isOwner) && !isPaused && (
            <Grid item xs={12} sm={8} md={10} xl={12} marginX={"auto"}>
              <LoadingButton
                variant="contained"
                loading={loading}
                disabled={!account || !!error}
                color="secondary"
                component="span"
                fullWidth
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: 50,
                }}
                onClick={handleSubmit}
              >
                <Typography variant="h6">Mint</Typography>
              </LoadingButton>
            </Grid>
          )}
        </section>
      </Layout>
    </>
  );
}

export default Collection;
