import { DeleteForever } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import theme from "../../theme";
import { Song } from "../../types/Song";
import { SongInputError, validate } from "../../validation/song";
import { Input } from "../Input";
import { Label } from "../Label";
import SongCardPreview from "./SongCardPreview";

interface SongInputProps {
  index: number;
  song: Song;
  setSong: (newSong: Song, index: number) => void;
  deleteSong: (index: number) => void;
  setError: (newError: SongInputError, index: number) => void;
  error?: SongInputError;
}

function SongInput({
  index,
  song,
  setSong,
  deleteSong,
  error,
  setError,
}: SongInputProps) {
  const { name = "", editions = 0, art, audio } = song;
  const { name: fileName } = audio;

  const handleDelete = () => {
    deleteSong(index);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSong = { ...song };
    newSong.name = e.target.value;
    setSong(newSong, index);
    setError(validate(newSong, "name"), index);
  };

  const handleEditionsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newSong = { ...song };
    newSong.editions = parseInt(e.target.value);
    setSong(newSong, index);
    setError(validate(newSong, "editions"), index);
  };

  const handleArtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSong = { ...song };
    newSong.art = e.target.files[0];
    setSong(newSong, index);
    setError(validate(newSong, "artwork"), index);
  };

  return (
    <>
      <Grid container item spacing={1} mb={"1rem"}>
        <Grid item xs={7}>
          <Stack spacing={2} width={"95%"}>
            <Grid container justifyContent={"space-between"}>
              <Typography
                variant="h6"
                color={theme.palette.grey[600]}
                textAlign={"left"}
                gutterBottom
                flexWrap={"wrap"}
              >
                {fileName}
              </Typography>
              <Button onClick={handleDelete}>
                <DeleteForever color={"action"} />
              </Button>
            </Grid>
            <TextField
              value={name}
              placeholder={fileName}
              label="Song Name"
              onChange={handleNameChange}
              error={!!error?.name}
              helperText={error?.name}
            />
            <TextField
              label="Editions"
              helperText={
                error?.editions ?? "# of NFTs available for this song"
              }
              variant="outlined"
              type={"number"}
              InputProps={{
                inputMode: "numeric",
                inputProps: { min: 1, max: 5000 },
              }}
              value={editions || ""}
              onChange={handleEditionsChange}
              error={!!error?.editions}
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
                component="span"
                fullWidth
                color={!!error?.artwork ? "error" : "primary"}
              >
                Upload Artwork
              </Button>
              {error?.artwork && (
                <Typography variant="caption" color={theme.palette.error.main}>
                  {error?.artwork}
                </Typography>
              )}
            </Label>
            {art && (
              <Typography
                textAlign={"left"}
                color={theme.palette.primary.light}
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
      <Divider sx={{ width: "100%", marginBottom: "1.5rem" }} />
    </>
  );
}

export default SongInput;
