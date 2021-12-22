import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import { AddResult } from "ipfs-core-types/src/root";
import useAudioNFTFactoryContract from "../hooks/useAudioNFTFactoryContract";
import { parseUnits } from "@ethersproject/units";
import {
  Alert,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/dist/client/router";
import DatePicker from "@mui/lab/DatePicker";
import { TimePicker } from "@mui/lab";
import mixpanel from "mixpanel-browser";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});

// TODO: Move this to config files
// Ropsten
// const AUDIO_NFT_FACTORY_ADDRESS = "0x0653A7E359412b09CD9f26f812d2F21feAbeE0b6";
// Rinkeby
const AUDIO_NFT_FACTORY_ADDRESS = "0xFF6dFA9573455adeda6bEB00F1dd7f783c2B4710";

/**
 * TODO:
 * x upload multiple files
 * x read durations of files
 * - split files into 30sec clips ??
 * - display clips to the screen ??
 * x upload audio files to IPFS
 * x upload img file to ipfs
 * x write json file
 * x upload json file to ipfs
 * x write/test nft contract
 * x write/test factory contract
 * x deploy contract
 * x add inputs for contract params
 * x user can deploy their own audio NFT project
 * x user can share a link for minting the NFT
 * x user can find their project on Open Sea
 * x don't allow submit if not connected to MM
 * - don't allow submit if not conencted to rinkeby
 */
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const uploadFilesToIPFS = async (
  fileDetails: { path: string; content: File | Blob | string }[]
) => {
  let results: AddResult[] = [];
  try {
    for await (const result of ipfs.addAll(fileDetails, {
      wrapWithDirectory: true,
    })) {
      results.push(result);
    }
  } catch (err) {
    console.error(err);
  }

  return results;
};

function Home() {
  const [audioFiles, setAudioFiles] = useState<FileList>(null);
  const [artFile, setArtFile] = useState<File>(null);
  const [name, setName] = useState("");
  const [mintCost, setMintCost] = useState("0.0");
  const [mintAmount, setMintAmount] = useState("0");
  const [revealDate, setRevealDate] = useState<Date | null>(new Date());
  const { account, library, chainId } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const isRinkeby = chainId === 4;
  const audioNFTFactory = useAudioNFTFactoryContract(AUDIO_NFT_FACTORY_ADDRESS);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  mixpanel.track("Page view", { page: "Home" });
  if (isConnected) mixpanel.track("Connected to MetaMask");

  const submitForm = async (e) => {
    e.preventDefault();
    mixpanel.track("Button click", { name: "Launch My NFT" });

    if (!audioFiles || !artFile) return; // TODO: Display validation

    setLoading(true);

    console.log("UPLOADING AUDIO...");
    const fileDetails = Array.from(audioFiles).map((file) => ({
      path: file.name,
      content: file,
    }));
    const audioUploadResults = await uploadFilesToIPFS(fileDetails);
    const audioDir = audioUploadResults.pop().cid.toString();

    console.log(audioDir);
    console.log(audioUploadResults);

    // TODO: Enforce/encourage artwork size
    console.log("UPLOADING ARTWORK...");
    const artworkUploadResults = await uploadFilesToIPFS([
      { path: artFile.name, content: artFile },
    ]);
    const artworkDir = artworkUploadResults.pop().cid.toString();
    console.log(`ipfs://${artworkDir}/${artFile.name}`);

    // Creating json ex:
    // https://stackoverflow.com/questions/16329293/save-json-string-to-client-pc-using-html5-api
    console.log("UPLOADING METADATA...");
    // TODO: Allow for greater control of metadata
    const combinedMetaData = audioUploadResults.map((audio, index) => {
      var metaData = {
        name: audio.path,
        description: "A cool song from my album.",
        image: `ipfs://${artworkDir}/${artFile.name}`,
        animation_url: `ipfs://${audioDir}/${audio.path}`,
        attributes: [
          {
            display_type: "number",
            trait_type: "Track Number",
            value: index + 1,
          },
          {
            trait_type: "Artist",
            value: "Medisin",
          },
          {
            trait_type: "Album",
            value: "My First Album",
          },
          {
            trait_type: "Year",
            value: "2021",
          },
        ],
      };

      return JSON.stringify(metaData);
    });
    const jsonFileDetails = combinedMetaData.map((content, index) => ({
      path: `${index + 1}.json`,
      content,
    }));
    const jsonUploadResults = await uploadFilesToIPFS(jsonFileDetails);
    const jsonDir = jsonUploadResults.pop().cid.toString();

    console.log(jsonDir);
    console.log(jsonUploadResults);

    console.log("DEPLOYING CONTRACT...");
    try {
      // TODO: Validate inputs
      const trx = await audioNFTFactory.createProject(
        name.trim(),
        "AAA", // TODO: ??
        parseUnits(mintCost, "ether"), // TODO: Validate mint cost
        audioFiles.length,
        mintAmount, // TODO: Validate mint cost
        `ipfs://${jsonDir}/`,
        `ipfs://${jsonDir}/`, // TODO: Setup pre-reveal
        Math.round(revealDate.getTime() / 1000),
        {
          from: account,
        }
      );

      const receipt = await trx.wait();
      mixpanel.track("Launch transaction confirmed"); // TODO: Update this to track price

      // TODO: Find a better way to navigate to new contract address
      const projects = await audioNFTFactory?.getDeployedProjects();
      const cid = [...projects].slice(-1);
      router.push(`/collection/${cid}`);
    } catch (error) {
      console.error("Failed to launch nft project", error);
      setLoading(false);
      // TODO: Set error alert
    }

    // SPLITTING AUDIO:
    // const readFiles = (reader: FileReader) => {
    //   const filesArr = Array.from(files);
    //   filesArr.forEach((file) => reader.readAsArrayBuffer(files[0]));
    // };

    // https://miguelmota.com/bytes/slice-audiobuffer/
    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   var audioContext = new (window.AudioContext ||
    //     window.webkitAudioContext)();

    //   audioContext.decodeAudioData(e.target.result as ArrayBuffer, (buffer) => {
    //     var duration = buffer.duration;

    //     console.log("duration:", duration);
    //   });
    // };

    // reader.onerror = (e) => {
    //   console.error("File could not be read: ", e);
    // };

    // readFiles(reader);
  };

  return (
    <div>
      {/* TODO: Move head & header to separate components */}
      <Head>
        <title>MintSplit | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <Container maxWidth="md">
          <Stack spacing={3} justifyContent={"start"} textAlign={"left"}>
            {!isConnected && (
              <Alert severity="warning">
                Please connect to MetaMask before launching
              </Alert>
            )}
            {isConnected && !isRinkeby && (
              <Alert severity="warning">
                Please connect to the Rinkeby network
              </Alert>
            )}
            <Typography variant="h3">
              Launch Your Audio NFT Project Here!
            </Typography>
            <Typography>Fill out the form to launch your NFT.</Typography>
            <Grid item xs={8}>
              <TextField
                id="project-name"
                label="Project Name"
                variant="outlined"
                fullWidth
                onFocus={(e) =>
                  mixpanel.track("Input focus", { name: "Project name" })
                }
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="cost-per-mint"
                label="Mint Cost"
                variant="outlined"
                fullWidth
                type={"number"}
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
            <Grid item xs={2}>
              <TextField
                id="mint-amount"
                label="Max Mint Qty"
                variant="outlined"
                fullWidth
                type={"number"}
                InputProps={{
                  inputMode: "numeric",
                  inputProps: { min: 0 },
                }}
                onChange={(e) => setMintAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Reveal Date"
                  value={revealDate}
                  onChange={(newRevealDateTime) => {
                    setRevealDate(newRevealDateTime);
                  }}
                />
                <br />
                <br />
                <TimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Reveal Time"
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
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Audio Files</Typography>
              <Label htmlFor="audio-files">
                {/* TODO: Indicate uploaded audio */}
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
                  component="span"
                  onClick={(e) =>
                    mixpanel.track("Button click", { name: "Upload Audio" })
                  }
                >
                  Upload Audio
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
            <Grid item xs={12}>
              <Typography variant="subtitle1">Artwork</Typography>
              <Label htmlFor="art-file">
                <Input
                  id="art-file"
                  accept="image/*"
                  type="file"
                  onChange={(e) => setArtFile(e.target.files[0])}
                />
                <Button variant="outlined" size="medium" component="span">
                  Upload Artwork
                </Button>
              </Label>
              {artFile && (
                <Typography
                  color={"slategray"}
                  variant="subtitle2"
                  mt={".5rem"}
                >
                  {artFile.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                variant="contained"
                loading={loading}
                disabled={loading || !isConnected || !isRinkeby}
                size="large"
                component="span"
                onClick={submitForm}
              >
                Launch My NFT
              </LoadingButton>
            </Grid>
          </Stack>
        </Container>
      </section>
    </div>
  );
}

export default Home;
