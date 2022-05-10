import { DeleteForever } from "@mui/icons-material";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../constants";
import theme from "../theme";
import { Content } from "../types/Content";
import { ContentInputError, validate } from "../validation/content";
import ContentPreviewCard from "./ContentPreviewCard";
import { Input } from "./Input";
import { Label } from "./Label";

interface ContentInputProps {
  title: string;
  content: Content;
  setContent: (newContent: Content) => void;
  handleDelete: () => void;
  error: ContentInputError;
  setError: (newError: ContentInputError) => void;
}

function ContentInput({
  title,
  content,
  setContent,
  handleDelete,
  error,
  setError,
}: ContentInputProps) {
  const { name, editions, artFile } = { ...content };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newContent = { ...content };
    newContent.name = e.target.value;
    setContent(newContent);
    setError(validate(newContent, "name"));
  };

  const handleEditionsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newContent = { ...content };
    newContent.editions = parseInt(e.target.value);
    setContent(newContent);
    setError(validate(newContent, "editions"));
  };

  const handleArtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newContent = { ...content };
    newContent.artFile = e.target.files[0];
    setContent(newContent);

    if (newContent.artFile.size <= FILE_LIMIT) return;
    const newError = { ...error };
    newError.artwork = `Artwork file size must be less than ${FILE_LIMIT_DISPLAY}`;
    setError(newError);
  };

  return (
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
              {title}
            </Typography>
            {content?.editions && content.editions > 0 && (
              <Button onClick={handleDelete}>
                <DeleteForever color={"action"} />
              </Button>
            )}
          </Grid>
          <TextField
            label="Song Name"
            variant="outlined"
            value={name || ""}
            onChange={handleNameChange}
            error={!!error?.name}
            helperText={error?.name}
          />
          <TextField
            label="Editions"
            helperText={error?.editions ?? "# of NFTs available for this song"}
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
          <Label htmlFor={"art-file"}>
            <Input
              id={"art-file"}
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
          {artFile && (
            <Typography
              textAlign={"left"}
              color={theme.palette.primary.light}
              variant="subtitle2"
            >
              {artFile.name}
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs justifyContent={"center"}>
        <Typography variant="subtitle2">Preview</Typography>
        <Grid item mt={".5rem"}>
          <ContentPreviewCard content={content} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ContentInput;
