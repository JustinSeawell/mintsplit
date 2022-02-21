import { LoadingButton } from "@mui/lab";
import { styled, Typography } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent } from "react";
import { useSongs } from "../../contexts/Songs";
import { convertAudioToSongs } from "./convertAudioToSongs";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});

interface UploadAudioProps {}

function UploadAudio({}: UploadAudioProps) {
  const { setSongs } = useSongs();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSongs(convertAudioToSongs(e.target.files));
    router.push("/setup/nfts");
  };

  return (
    <>
      <Typography variant="h3" fontWeight={600} gutterBottom component={"div"}>
        Audio NFTs Go{" "}
        <Typography
          variant="h3"
          fontWeight={"inherit"}
          display={"inline"}
          color={"primary"}
        >
          Here
        </Typography>
        👇
      </Typography>
      <Label htmlFor="audio-files">
        <Input
          id="audio-files"
          accept="audio/*"
          multiple
          type="file"
          onChange={handleChange}
        />
        <LoadingButton
          variant="contained"
          component="span"
          fullWidth
          style={{
            padding: "1.5rem",
            borderRadius: 4,
          }}
        >
          <Typography fontSize={"1.1rem"}>Upload Audio</Typography>
        </LoadingButton>
      </Label>
    </>
  );
}

export default UploadAudio;
