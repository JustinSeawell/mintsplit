import { LoadingButton } from "@mui/lab";
import { Grid, styled, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { useSongs } from "../../contexts/Songs";
import SetupNav from "../SetupNav";
import { convertAudioToSongs } from "../UploadAudio/convertAudioToSongs";
import SongInput from "./SongInput";

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
      <Label htmlFor="audio-files" sx={{ marginTop: "1rem" }}>
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
