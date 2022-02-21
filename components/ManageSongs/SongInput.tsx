import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import theme from "../../theme";
import { Song } from "../../types/Song";
import SongCardPreview from "./SongCardPreview";

const Input = styled("input")({
  display: "none",
});

const Label = styled("label")({
  display: "inline-block",
});

interface SongInputProps {
  index: number;
  song: Song;
  setSong: (newSong: Song, index: number) => void;
}

function SongInput({ index, song, setSong }: SongInputProps) {
  const { name = "", editions = 0, art, audio } = song;
  const { name: fileName } = audio;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSong = { ...song };
    newSong.name = e.target.value;
    setSong(newSong, index);
  };

  const handleEditionsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newSong = { ...song };
    newSong.editions = parseInt(e.target.value);
    setSong(newSong, index);
  };

  const handleArtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSong = { ...song };
    newSong.art = e.target.files[0];
    setSong(newSong, index);
  };

  return (
    <>
      <Grid container item spacing={1}>
        <Grid container item>
          <Typography variant="h6" color={theme.palette.secondary.light}>
            {fileName}
          </Typography>
        </Grid>
        <Grid item xs={7} mt={"1rem"}>
          <Stack spacing={2} width={"95%"}>
            <TextField
              value={name}
              placeholder={fileName}
              label="Song Name"
              onChange={handleNameChange}
            />
            <TextField
              label="Editions"
              helperText="# of NFTs available for this song"
              variant="outlined"
              type={"number"}
              InputProps={{
                inputMode: "numeric",
                inputProps: { min: 1, max: 5000 },
              }}
              value={editions || ""}
              onChange={handleEditionsChange}
            />
            <Label htmlFor={`art-file-${index}`}>
              <Input
                id={`art-file-${index}`}
                accept="image/*"
                type="file"
                onChange={handleArtChange}
              />
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                component="span"
                fullWidth
              >
                Upload Artwork
              </Button>
            </Label>
            {art && (
              <Typography
                textAlign={"left"}
                color={theme.palette.secondary.light}
                variant="subtitle2"
              >
                {art.name}
              </Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs justifyContent={"center"}>
          <Typography variant="subtitle2">Preview</Typography>
          <Grid item mt={".5rem"}>
            <SongCardPreview song={song} />
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ width: "100%", marginTop: "1rem" }} />
    </>
  );
}

export default SongInput;
