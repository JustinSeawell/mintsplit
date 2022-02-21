import { formatEther, parseUnits } from "@ethersproject/units";
import {
  DatePicker,
  LoadingButton,
  LocalizationProvider,
  TimePicker,
} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Alert,
  Button,
  Grid,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import useAudioNFTFactoryContract from "../../hooks/useAudioNFTFactoryContract";
import useDeploymentFee from "../../hooks/useDeploymentFee";
import OrderSummary from "../OrderSummary";
import { assignMetadataFilePaths, createMetadata } from "./createMetadata";
import { getProjectCreated } from "./getProjectCreated";
import { getIPFSDirectory, uploadFilesToIPFS } from "./uploadToIPFS";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [mintCost, setMintCost] = useState("0.0");
  const [mintAmount, setMintAmount] = useState("0");
  const [revealDate, setRevealDate] = useState<Date | null>(new Date());
  const [releaseDate, setReleaseDate] = useState<Date | null>(new Date());
  const [artFile, setArtFile] = useState<File>(null);
  const [revealArtFile, setRevealArtFile] = useState<File>(null);
  const [audioFiles, setAudioFiles] = useState<FileList>(null);
  const [loading, setLoading] = useState(false);
  const { account, library, chainId } = useWeb3React();
  const theme = useTheme();
  const router = useRouter();
  const factoryAddress = process.env.NEXT_PUBLIC_AUDIO_NFT_FACTORY_ADDRESS;
  const audioNFTFactory = useAudioNFTFactoryContract(factoryAddress);
  const { data: deploymentFee } = useDeploymentFee(factoryAddress);

  const isConnected = typeof account === "string" && !!library;
  const isRinkeby = chainId === 4;

  useEffect(() => {
    if (isConnected) mixpanel.track("Connected to MetaMask");
  }, [isConnected]);

  const handleSubmit = async () => {
    // TODO: Form validation
    setLoading(true);

    const fileDetails = Array.from(audioFiles).map((file) => ({
      path: file.name,
      content: file,
    }));
    const audioUploadResults = await uploadFilesToIPFS(fileDetails);
    const audioDirCID = getIPFSDirectory(audioUploadResults);

    const artworkUploadResults = await uploadFilesToIPFS([
      { path: artFile.name, content: artFile },
    ]);
    const artworkDir = getIPFSDirectory(artworkUploadResults);

    const metadata = createMetadata({
      songs: audioUploadResults,
      description,
      imageURI: `ipfs://${artworkDir}/${artFile.name}`,
      audioDirCID,
      albumName,
      artistName,
      releaseDate: releaseDate.toLocaleString("en-US"),
    });

    const jsonUploadResults = await uploadFilesToIPFS(
      assignMetadataFilePaths(metadata)
    );
    const jsonDir = getIPFSDirectory(jsonUploadResults);

    try {
      const trx = await audioNFTFactory.createProject(
        projectName.trim(),
        artistName.trim().substring(0, 3),
        parseUnits(mintCost, "ether"),
        audioFiles.length, // TODO: update this for editions
        mintAmount,
        `ipfs://${jsonDir}/`,
        `ipfs://${jsonDir}/`, // TODO: Setup pre-reveal URI
        Math.round(revealDate.getTime() / 1000),
        false, // TODO: Parameterize
        {
          from: account,
          value: deploymentFee,
        }
      );

      const receipt = await trx.wait();
      const { args } = getProjectCreated(receipt);
      const [contractAddress] = args;
      mixpanel.track("Launch transaction confirmed");

      router.push(`/collection/${contractAddress}`);
    } catch (error) {
      /**
       * TODO:
       * - set error alert
       * - log to sentry
       */
      console.error("Failed to launch nft project", error);
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3} alignItems={"center"}>
      <Grid container item xs={8}>
        {!isConnected && (
          <Alert sx={{ width: "100%" }} severity="warning">
            Please connect to MetaMask
          </Alert>
        )}
        {isConnected && !isRinkeby && (
          <Alert sx={{ width: "100%" }} severity="warning">
            Please connect to MetaMask
          </Alert>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" fontWeight={600}>
          Audio NFTs Go{" "}
          <Typography
            variant="h2"
            fontWeight={"inherit"}
            display={"inline"}
            color={"primary"}
          >
            Here
          </Typography>
          👇
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" fontWeight={300}>
          Complete the form to launch your NFT project on the{" "}
          <Typography
            variant="subtitle1"
            display={"inline"}
            color={"primary"}
            fontWeight={500}
          >
            Ethereum{" "}
          </Typography>
          blockchain.
        </Typography>
      </Grid>
      <Grid container item xs={11} md={6}>
        <Typography variant="h6" fontWeight={600} mb={".75rem"}>
          Project Details
        </Typography>
        <TextField
          id="project-name"
          label="Project Name"
          variant="outlined"
          fullWidth
          onFocus={(e) =>
            mixpanel.track("Input focus", { name: "Project name" })
          }
          onChange={(e) => setProjectName(e.target.value)}
        />
      </Grid>
      <Grid container item xs={11} md={6}>
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />
      </Grid>
      <Grid container item xs={11} md={6}>
        <Grid container item xs mr={"1rem"}>
          <TextField
            id="cost-per-mint"
            label="Mint Price"
            helperText="The price your fans will pay to mint 1 of your songs."
            variant="outlined"
            type={"number"}
            fullWidth
            value={mintCost}
            InputProps={{
              inputMode: "numeric",
              inputProps: { step: ".01", min: 0 },
              startAdornment: (
                <InputAdornment position="start">Ξ</InputAdornment>
              ),
            }}
            onChange={(e) => setMintCost(e.target.value)}
          />
        </Grid>
        <Grid container item xs>
          <TextField
            id="mint-amount"
            label="Max Mint Qty"
            helperText="The maximum number of songs your fans are allowed to mint."
            variant="outlined"
            type={"number"}
            value={mintAmount}
            fullWidth
            InputProps={{
              inputMode: "numeric",
              inputProps: { min: 0 },
            }}
            onChange={(e) => setMintAmount(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container item xs={11} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container item xs mr={"1rem"}>
            <DatePicker
              renderInput={(props) => (
                <TextField
                  fullWidth
                  helperText="The date your project will be available to mint."
                  {...props}
                />
              )}
              label="Release Date"
              value={revealDate}
              onChange={(newRevealDateTime) => {
                setRevealDate(newRevealDateTime);
              }}
            />
          </Grid>
          <Grid container item xs>
            <TimePicker
              renderInput={(props) => (
                <TextField
                  fullWidth
                  helperText="The time your project will be available to mint."
                  {...props}
                />
              )}
              label="Release Time"
              value={revealDate}
              onChange={(newRevealTime) => {
                setRevealDate((prevDate) => {
                  const date = new Date(prevDate.getTime());
                  date.setHours(
                    newRevealTime.getHours(),
                    newRevealTime.getMinutes(),
                    newRevealTime.getSeconds()
                  );

                  return date;
                });
              }}
            />
          </Grid>
        </LocalizationProvider>
      </Grid>
      {/* <Grid container item xs={11} md={6}>
        <Typography variant="h6" fontWeight={600} mb={".75rem"}>
          Album Metadata
        </Typography>
        <TextField
          id="artist-name"
          label="Artist Name"
          variant="outlined"
          fullWidth
          onChange={(e) => setArtistName(e.target.value)}
        />
      </Grid> */}
      {/* <Grid container item xs={11} md={6}>
        <TextField
          id="album"
          label="Album Name"
          variant="outlined"
          fullWidth
          onChange={(e) => setAlbumName(e.target.value)}
        />
      </Grid> */}
      {/* <Grid container item xs={11} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container item xs>
            <DatePicker
              renderInput={(props) => (
                <TextField
                  helperText="The date your album was released IRL."
                  fullWidth
                  {...props}
                />
              )}
              label="Album Release Date"
              value={revealDate}
              onChange={(newRevealDateTime) => {
                setReleaseDate(newRevealDateTime);
              }}
            />
          </Grid>
        </LocalizationProvider>
      </Grid> */}
      <Grid container item xs={11} md={6}>
        <Grid container mb={"1rem"}>
          <Typography variant="h6" fontWeight={600} mb={".75rem"}>
            Artwork
          </Typography>
          <Grid container>
            <Label htmlFor="art-file">
              <Input
                id="art-file"
                accept="image/*"
                type="file"
                onChange={(e) => setArtFile(e.target.files[0])}
              />
              <Button
                variant="outlined"
                size="medium"
                color="secondary"
                component="span"
              >
                Upload Artwork
              </Button>
            </Label>
          </Grid>
          <Grid container>
            {artFile && (
              <Typography
                color={theme.palette.secondary.light}
                variant="subtitle2"
                mt={".5rem"}
              >
                {artFile.name}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid container>
            <Label htmlFor="reveal-art-file">
              <Input
                id="reveal-art-file"
                accept="image/*"
                type="file"
                onChange={(e) => setRevealArtFile(e.target.files[0])}
              />
              <Button
                variant="outlined"
                size="medium"
                color="secondary"
                component="span"
              >
                Upload Reveal Art
              </Button>
            </Label>
          </Grid>
          <Grid container>
            {revealArtFile && (
              <Typography
                color={theme.palette.secondary.light}
                variant="subtitle2"
                mt={".5rem"}
              >
                {revealArtFile.name}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={11} md={6}>
        <Grid item>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={".75rem"}
            textAlign={"left"}
          >
            Audio
          </Typography>
          <Label htmlFor="audio-files">
            <Input
              id="audio-files"
              accept="audio/*"
              multiple
              type="file"
              onChange={(e) => setAudioFiles(e.target.files)}
            />
            <Button
              variant="outlined"
              size="medium"
              color="secondary"
              component="span"
            >
              Upload Audio Files
            </Button>
          </Label>
          {audioFiles &&
            audioFiles.length > 0 &&
            Array.from(audioFiles).map((file) => (
              <Typography
                color={"slategray"}
                variant="subtitle2"
                mt={".5rem"}
                key={file.name}
              >
                {file.name}
              </Typography>
            ))}
        </Grid>
      </Grid>
      <Grid container item xs={11} md={6}>
        {isConnected && isRinkeby && (
          <OrderSummary
            numSongs={audioFiles?.length ?? 0}
            fee={formatEther(deploymentFee ?? 0)}
          />
        )}
      </Grid>
      <Grid container item xs={12} md={7}>
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={loading || !isConnected || !isRinkeby} // TODO: Update this to check for mainnet
          component="span"
          fullWidth
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: 50,
          }}
          onClick={handleSubmit}
        >
          Launch My NFT 🚀
        </LoadingButton>
      </Grid>
    </Stack>
  );
}

export default CreateProject;
