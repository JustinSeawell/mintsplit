import { LoadingButton } from "@mui/lab";
import { Card, Divider, Grid, styled, Typography } from "@mui/material";
import { ChangeEvent, useMemo } from "react";
import { useSongs } from "../../contexts/Songs";
import usePackages from "../../hooks/usePackages";
import SetupNav from "../SetupNav";
import { convertAudioToSongs } from "../UploadAudio/convertAudioToSongs";
import SongInput from "./SongInput";
import SpaceCard from "./SpaceCard";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});
interface ManageSongsProps {
  onSuccess: () => void;
  handleBack: () => void;
}

function ManageSongs({ onSuccess, handleBack }: ManageSongsProps) {
  const { songs, setSong, setSongs } = useSongs();
  const nftCount = useMemo(
    () =>
      songs.reduce(
        (sum, { editions }) => sum + (isNaN(editions) ? 0 : editions),
        0
      ),
    [songs]
  );
  const { data: packages } = usePackages();
  const [package1] = packages ?? [];

  const handleNext = () => {
    // TODO: Validate input
    onSuccess();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSongs = [...songs, ...convertAudioToSongs(e.target.files)];
    setSongs(newSongs);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Content
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Configure your NFT content for the blockchain.
      </Typography>
      <Grid item xs={10} marginX={"auto"} textAlign="left">
        <Label htmlFor="audio-files" sx={{ marginY: "1rem" }}>
          <Input
            id="audio-files"
            accept="audio/*"
            multiple
            type="file"
            onChange={handleChange}
          />
          <LoadingButton
            variant="contained"
            color="secondary"
            size="large"
            component="span"
            fullWidth
            sx={{ padding: "1rem 1.5rem" }}
          >
            Add Songs
          </LoadingButton>
        </Label>
        <Grid item xs={4}>
          <SpaceCard used={nftCount} limit={package1?.limit?.toNumber() - 1} />
        </Grid>
        <Divider sx={{ width: "100%", marginTop: "1rem" }} />
      </Grid>
      <Grid item mt={"2rem"} xs={10} marginX={"auto"}>
        {songs.map((song, index) => (
          <SongInput key={index} index={index} song={song} setSong={setSong} />
        ))}
      </Grid>
      <Grid item xs={10} m={"auto"}>
        <SetupNav handleNext={handleNext} handleBack={handleBack} />
      </Grid>
    </>
  );
}

export default ManageSongs;
