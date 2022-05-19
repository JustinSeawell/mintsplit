import { formatEther } from "@ethersproject/units";
import {
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import GreyBox from "../components/GreyBox";
import Layout from "../components/Layout";
import useTokenFee from "../hooks/useTokenFee";
import { track } from "../utils/track";

/**
 * TODO:
 * - add static props
 * - seo metadata
 * x responsive
 * x add mixpanel analytics
 */

function Home() {
  const router = useRouter();
  const [qty, setQty] = useState(10);
  const { data: tokenFee } = useTokenFee(qty);

  useEffect(() => {
    track("viewed home page");
  }, []);

  const handleClick = () => {
    track("clicked homepage cta");
    router.push("/setup");
  };

  return (
    <>
      <Layout title="Create Audio NFT Projects & Split Revenue with Collaborators">
        <Stack spacing={20}>
          <section>
            <Grid container mt={"4rem"}>
              <Grid item xs={12} md={6}>
                <img
                  src="images/headphones-opt.png"
                  alt="headphones render"
                  srcSet=""
                  width="100%"
                  height={"auto"}
                />
              </Grid>
              {/* <Grid item xs={0} md={1}></Grid> */}
              <Grid item xs={12} md={6} textAlign="left">
                <Typography
                  variant="h1"
                  fontWeight="700"
                  fontSize="4rem"
                  gutterBottom
                >
                  Sell Your Music <br />
                  as NFTs
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={"300"}
                  fontSize="1.5rem"
                  lineHeight={"40px"}
                  gutterBottom
                >
                  Sell your music NFTs on the Ethereum blockchain, and split
                  your revenue with collaborators.
                </Typography>
                <Grid container mt={"2rem"}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ padding: "1rem 1.5rem", mr: "1rem" }}
                    onClick={handleClick}
                  >
                    Start Creating
                  </Button>
                  {/* <Button variant="text">Watch Video</Button> */}
                </Grid>
              </Grid>
            </Grid>
          </section>
          <section>
            <Grid container>
              <Grid item xs={12} md={4} p={"2rem"}>
                <Typography
                  fontWeight={"500"}
                  fontSize={"1.5rem"}
                  lineHeight={"31px"}
                  gutterBottom
                >
                  Own Your Art
                </Typography>
                <Typography
                  fontWeight={"300"}
                  fontSize={"1rem"}
                  lineHeight={"30px"}
                >
                  Host your files on IPFS. Manage your content on the Ethereum
                  blockchain.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} p={"2rem"}>
                <Typography
                  fontWeight={"500"}
                  fontSize={"1.5rem"}
                  lineHeight={"31px"}
                  gutterBottom
                >
                  Split Your Revenue
                </Typography>
                <Typography
                  fontWeight={"300"}
                  fontSize={"1rem"}
                  lineHeight={"30px"}
                >
                  Share primary & secondary NFT sales with collaborators.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} p={"2rem"}>
                <Typography
                  fontWeight={"500"}
                  fontSize={"1.5rem"}
                  lineHeight={"31px"}
                  gutterBottom
                >
                  Sell Your NFTs
                </Typography>
                <Typography
                  fontWeight={"300"}
                  fontSize={"1rem"}
                  lineHeight={"30px"}
                >
                  Share your public mint page with collectors, or mint your own.
                </Typography>
              </Grid>
            </Grid>
          </section>
          <section>
            <Grid container justifyContent={"center"}>
              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={"700"}
                  fontSize={"2.25rem"}
                  lineHeight={"47px"}
                  gutterBottom
                >
                  A Simple Tool at a Great Price
                </Typography>
                <Typography
                  fontWeight={"300"}
                  fontSize={"1.5rem"}
                  lineHeight={"40px"}
                >
                  Start small and scale as you go.
                </Typography>
                <Grid container item xs={12} mt={"3rem"} alignItems={"center"}>
                  <Grid item xs={12} md={3} py={".5rem"}>
                    <TextField
                      variant="outlined"
                      type={"number"}
                      value={qty}
                      InputProps={{
                        inputMode: "numeric",
                        inputProps: { min: 0 },
                        endAdornment: (
                          <InputAdornment position="end">NFTs</InputAdornment>
                        ),
                      }}
                      onChange={(e) => setQty(parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md py={".5rem"}>
                    <Typography fontWeight={"300"} fontSize="1.25rem">
                      for
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md py={".5rem"}>
                    <Typography
                      fontWeight={"300"}
                      fontSize="2rem"
                      lineHeight={"42px"}
                    >
                      {tokenFee ? `Ξ${formatEther(tokenFee)}` : "-"}
                    </Typography>
                    <Typography
                      fontWeight={"300"}
                      fontSize="1rem"
                      lineHeight={"40px"}
                    >
                      (+gas)
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </section>
          <section>
            <Grid mb={"4rem"}>
              <Typography
                fontWeight={"700"}
                fontSize={"3rem"}
                lineHeight={"62px"}
                gutterBottom
              >
                Ready to get going?
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ padding: "1rem 1.5rem", mt: "1rem" }}
                onClick={handleClick}
              >
                Start Creating
              </Button>
            </Grid>
          </section>
        </Stack>
      </Layout>
    </>
  );
}

export default Home;
