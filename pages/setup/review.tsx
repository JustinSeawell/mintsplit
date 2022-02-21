import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Layout from "../../components/Layout";
import ManageProject from "../../components/ManageProject";
import { getTokenRanges } from "../../components/ManageRevenueSplits/getTokenRanges";
import SongCardPreview from "../../components/ManageSongs/SongCardPreview";
import SetupNav from "../../components/SetupNav";
import { useProject } from "../../contexts/Project";
import { useSongs } from "../../contexts/Songs";
import theme from "../../theme";
import Image from "next/image";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { shortenHex } from "../../util";
import { convertToPercentage } from "../../components/ManageRevenueSplits/convertToBps";
import { LoadingButton } from "@mui/lab";
import OrderSummary from "../../components/OrderSummary";
import useDeploymentFee from "../../hooks/useDeploymentFee";
import { formatEther } from "@ethersproject/units";

function SetupReview() {
  mixpanel.track("Page view", { page: "Setup Review" });
  const { project } = useProject();
  const { songs } = useSongs();
  const { mintSplits, royaltySplits } = useRevenueSplits();
  const factoryAddress = process.env.NEXT_PUBLIC_AUDIO_NFT_FACTORY_ADDRESS;
  const { data: deploymentFee } = useDeploymentFee(factoryAddress);

  const { name, description, artistName, mintCost } = project;
  const tokenRanges = getTokenRanges(songs);
  const totalNFTCount = tokenRanges[tokenRanges.length - 1][1];

  return (
    <>
      <Head>
        <title>MintSplit | Setup Review</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
          <section>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4">Review Your Setup</Typography>
              <Typography variant="body1">
                Review your project settings before launching.
              </Typography>
              <Grid container xs={8}>
                <Card
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "1rem 2rem",
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {name}
                    </Typography>
                    <Typography variant="body1">{description}</Typography>
                    <Typography variant="body1">by {artistName}</Typography>
                    <Divider sx={{ width: "100%", marginTop: "1rem" }} />
                    <Typography variant="body1" mt={"1rem"}>
                      <strong>Mint Cost:</strong> {mintCost} Ξ
                    </Typography>
                    <Typography variant="body1" mt={"1rem"}>
                      <strong># of Songs:</strong> {songs.length}
                    </Typography>
                    <Typography variant="body1" mt={"1rem"}>
                      <strong>Total NFTs created:</strong> {totalNFTCount}
                    </Typography>
                    <Typography variant="body1" mt={"1rem"}>
                      <strong>Total Project Value:</strong>{" "}
                      {totalNFTCount * mintCost} Ξ
                    </Typography>
                    <Divider sx={{ width: "100%", marginTop: "1rem" }} />

                    {songs.map((song, songIndex) => {
                      const {
                        name,
                        editions,
                        audio: { name: fileName },
                        tmpAudioUrl,
                        art,
                      } = song;

                      return (
                        <>
                          <Grid container item mt={"1rem"}>
                            <Grid item xs>
                              <Typography variant="h6" gutterBottom>
                                {name}
                              </Typography>
                              <Typography
                                variant="body1"
                                gutterBottom
                                color={theme.palette.grey[600]}
                              >
                                {fileName}
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                {editions} editions
                              </Typography>
                              <Grid
                                container
                                item
                                justifyContent={"center"}
                                mt={"1rem"}
                              >
                                <figure style={{ margin: 0, width: "100%" }}>
                                  <audio
                                    controls
                                    src={tmpAudioUrl}
                                    style={{ display: "block", width: "100%" }}
                                  >
                                    Your browser does not support the
                                    <code>audio</code> element.
                                  </audio>
                                </figure>
                              </Grid>
                            </Grid>
                            <Grid container item xs justifyContent={"end"}>
                              <Box
                                sx={{
                                  width: 160,
                                  height: 160,
                                  borderRadius: 2,
                                  backgroundColor: theme.palette.grey[500],
                                  overflow: "hidden",
                                }}
                                position={"relative"}
                              >
                                <Image
                                  src={art ? URL.createObjectURL(art) : null}
                                  alt=""
                                  lazyBoundary=""
                                  layout="fill"
                                  unoptimized
                                  quality={100}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                          <Grid item mt={"1rem"}>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Split Type</TableCell>
                                    <TableCell>Split %</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {mintSplits[songIndex].splits.map(
                                    ({ recipient, bps }, mintIndex) => (
                                      <TableRow key={`mint-${mintIndex}`}>
                                        <TableCell>
                                          {shortenHex(recipient, 4)}
                                        </TableCell>
                                        <TableCell>Mint</TableCell>
                                        <TableCell>
                                          {convertToPercentage(bps)}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                  {royaltySplits[songIndex].splits.map(
                                    ({ recipient, bps }, royaltyIndex) => (
                                      <TableRow key={`royalty-${royaltyIndex}`}>
                                        <TableCell>
                                          {shortenHex(recipient, 4)}
                                        </TableCell>
                                        <TableCell>Royalty</TableCell>
                                        <TableCell>
                                          {convertToPercentage(bps).toFixed(0)}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </>
                      );
                    })}
                    <Grid item mt={"2rem"}>
                      <OrderSummary fee={formatEther(deploymentFee ?? 0)} />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={9}>
                <LoadingButton
                  variant="contained"
                  //   loading={loading}
                  //   disabled={loading || !isConnected || !isRinkeby} // TODO: Update this to check for mainnet
                  component="span"
                  fullWidth
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    borderRadius: 50,
                  }}
                  //   onClick={handleSubmit}
                >
                  <Typography variant="h6">Launch My Project 🚀</Typography>
                </LoadingButton>
              </Grid>
            </Stack>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default SetupReview;
