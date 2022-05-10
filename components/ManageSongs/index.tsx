import { LoadingButton } from "@mui/lab";
import { Alert, Divider, Grid, Typography } from "@mui/material";
import mixpanel from "mixpanel-browser";
import { ChangeEvent, useState } from "react";
import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../../constants";
import { useSongs } from "../../contexts/Songs";
import { SongInputError, validate } from "../../validation/song";
import { Input } from "../Input";
import { Label } from "../Label";
import SetupNav from "../SetupNav";
import { convertAudioToSongs } from "../UploadAudio/convertAudioToSongs";
import SongInput from "./SongInput";

interface ManageSongsProps {
  onSuccess: () => void;
  handleBack: () => void;
}

function ManageSongs({ onSuccess, handleBack: goBack }: ManageSongsProps) {
  const { songs, setSong, deleteSong, setSongs } = useSongs();
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState<Map<number, SongInputError>>(
    new Map<number, SongInputError>()
  );

  const setInputError = (newError: SongInputError, index: number) => {
    const newInputErrors = new Map<number, SongInputError>(inputErrors);
    Object.keys(newError).length === 0
      ? newInputErrors.delete(index)
      : newInputErrors.set(index, newError);
    setInputErrors(newInputErrors);
  };

  const validateSongs = () => {
    const newErrors = new Map<number, SongInputError>();
    songs.forEach((song, i) => {
      const newError = validate(song);
      if (Object.keys(newError).length > 0) newErrors.set(i, newError);
    });
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateSongs();
    if (newErrors.size > 0) {
      setInputErrors(newErrors);
      return;
    }

    mixpanel.track("edited content");
    onSuccess();
  };

  const handleBack = () => {
    setSongs([]);
    goBack();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let isAllowed = true;

    Array.from(e.target.files).forEach((file) => {
      if (file.size > FILE_LIMIT) {
        isAllowed = false;
        setError(`Each file should be less than ${FILE_LIMIT_DISPLAY}`); // TODO: Update text to dynamically display file size
      }
    });

    if (!isAllowed) return;
    setError("");
    const newSongs = [...songs, ...convertAudioToSongs(e.target.files)];
    setSongs(newSongs);
  };

  return (
    <>
      {error && (
        <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
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
        <Divider sx={{ width: "100%", marginTop: "1rem" }} />
      </Grid>
      <Grid item mt={"2rem"} xs={10} marginX={"auto"}>
        {songs.map((song, index) => (
          <SongInput
            key={index}
            index={index}
            song={song}
            setSong={setSong}
            deleteSong={deleteSong}
            error={inputErrors.get(index)}
            setError={setInputError}
          />
        ))}
      </Grid>
      <Grid item xs={10} m={"auto"}>
        <SetupNav
          handleNext={handleNext}
          handleBack={handleBack}
          nextDisabled={inputErrors.size > 0}
        />
      </Grid>
    </>
  );
}

export default ManageSongs;
