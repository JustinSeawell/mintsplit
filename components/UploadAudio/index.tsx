import mixpanel from "mixpanel-browser";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useSongs } from "../../contexts/Songs";
import { convertAudioToSongs } from "./convertAudioToSongs";
import { Input } from "../Input";
import { Label } from "../Label";
import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../../constants";

interface UploadAudioProps {
  onSuccess: () => void;
}

function UploadAudio({ onSuccess }: UploadAudioProps) {
  const [error, setError] = useState("");
  const { setSongs } = useSongs();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let isAllowed = true;

    Array.from(e.target.files).forEach((file) => {
      if (file.size > FILE_LIMIT) {
        isAllowed = false;
        setError(`Each file should be less than ${FILE_LIMIT_DISPLAY}`); // TODO: Update text to dynamically display file size
      }
    });

    if (!isAllowed) return;
    setSongs(convertAudioToSongs(e.target.files));
    mixpanel.track("uploaded content");
    onSuccess();
  };

  return (
    <>
      {error && (
        <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Typography variant="h4" gutterBottom>
        Upload Content
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Upload your content to begin creating.
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
          Upload Audio
        </LoadingButton>
      </Label>
    </>
  );
}

export default UploadAudio;
