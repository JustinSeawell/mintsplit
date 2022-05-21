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
import theme from "../theme";
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
      <div
        style={{
          backgroundColor: theme.palette.secondary.main,
          color: "#fff",
          padding: ".5rem 1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Coming Soon!
      </div>
      <Layout title="Create Audio NFT Projects & Split Revenue with Collaborators">
        <Stack spacing={10}>
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
                  <Typography>Coming Soon!</Typography>
                  {/* <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ padding: "1rem 1.5rem", mr: "1rem" }}
                    onClick={handleClick}
                  >
                    Start Creating
                  </Button> */}
                  {/* <Button variant="text">Coming Soon!</Button> */}
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
          {/* <section>
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
          </section> */}
        </Stack>
      </Layout>
    </>
  );
}

export default Home;
