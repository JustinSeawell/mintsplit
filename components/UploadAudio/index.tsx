import { LoadingButton } from "@mui/lab";
import { styled, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { useSongs } from "../../contexts/Songs";
import { convertAudioToSongs } from "./convertAudioToSongs";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});

interface UploadAudioProps {
  onSuccess: () => void;
}

function UploadAudio({ onSuccess }: UploadAudioProps) {
  const { setSongs } = useSongs();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // TODO: update to use new context
    setSongs(convertAudioToSongs(e.target.files));
    onSuccess();
  };

  return (
    <>
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
