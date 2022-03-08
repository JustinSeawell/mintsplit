import { Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import Layout from "../components/Layout";
import NFTCard from "../components/NFTCard";
import useCollectionData from "../hooks/useCollectionData";
import useNFTContract from "../hooks/useNFTContract";

/**
 * TODO:
 * - cover error scenario (ex: minting fails)
 * - Check to make sure contract exists in nft factory project
 *
 */
function Collection() {
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const erc721 = useNFTContract(contractAddress);
  const { data } = useCollectionData(contractAddress);
  const { account } = useWeb3React<Web3Provider>();
  const {
    name,
    secondsUntilMinting,
    contentCount,
    mintPrice,
    totalSupply,
    totalSupplyLimit,
  } = {
    ...data,
  };
  const [contentQty, setContentQty] = useState<Map<number, number>>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleQtyChange = (id: number, amount: number) => {
    const newMap = new Map<number, number>(contentQty);
    newMap.set(id, amount);
    setContentQty(newMap);
  };

  const handleSubmit = async () => {
    const ids = [];
    contentQty.forEach((amount, id) => {
      ids.push(...Array(amount).fill(id));
    });

    await erc721.mint(ids, {
      from: account,
      value: parseEther(
        (totalAmount * parseFloat(formatEther(mintPrice))).toPrecision(3)
      ),
    });
  };

  useEffect(() => {
    if (!mintPrice) return;

    let newTotalAmount = 0;
    contentQty?.forEach((amount, contentId) => {
      newTotalAmount += amount;
    });

    setTotalAmount(newTotalAmount);
  }, [contentQty, mintPrice]);

  /**
   * TODO:
   * - alert message when artist is viewing the page
   * - mint instructions
   * - artist info
   * - countdown clock
   */

  return (
    <>
      <Head>
        <title>MintSplit | Collection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {!data && <CircularProgress size={80} />}
        {data && (
          <>
            {!account && (
              <Grid item xs={8} marginX={"auto"} mb={"2rem"}>
                <Alert severity="info">Connect to MetaMask to mint NFTs.</Alert>
              </Grid>
            )}
            <Typography variant="h2" gutterBottom>
              {name}
            </Typography>
            {secondsUntilMinting.toNumber() <= 0 && (
              <Typography variant="h4" gutterBottom>
                Minted {totalSupply.toString()} / {totalSupplyLimit.toString()}
              </Typography>
            )}
            {secondsUntilMinting.toNumber() > 0 && (
              <CountdownTimer secondsRemaining={10000} />
            )}
            <Grid container marginX={"auto"} justifyContent={"center"}>
              <Grid container item xs={8} spacing={3} mt={"1.5rem"}>
                {Array.from(Array(contentCount.toNumber()).keys()).map(
                  (n, i, arr) => (
                    <Grid key={n} item xs={12} md={6} xl={4}>
                      <NFTCard
                        contractAddress={contractAddress}
                        contentId={n + 1}
                        handleQtyChange={handleQtyChange}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
            <Grid item xs={8} mt={"2rem"} marginX={"auto"}>
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
                  {totalAmount} NFTs x {formatEther(mintPrice)} Ξ
                </Typography>
                <Typography fontSize={"1.5rem"} fontWeight={300}>
                  Total:{" "}
                  {(
                    totalAmount * parseFloat(formatEther(mintPrice))
                  ).toPrecision(3)}{" "}
                  Ξ (+ gas)
                </Typography>
                <Typography variant="caption">
                  This is the cost to mint your selected NFTs on the blockchain.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8} marginX={"auto"}>
              <LoadingButton
                variant="contained"
                // loading={loading}
                // disabled={loading || !isConnected || !isRinkeby} // TODO: Update this to check for mainnet
                disabled={!account}
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
          </>
        )}
      </Layout>
    </>
  );
}

export default Collection;
