import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { Song } from "../../types/Song";

interface SongCardPreviewProps {
  song: Song;
}

function SongCardPreview({ song }: SongCardPreviewProps) {
  const { name, editions, audio, art, tmpAudioUrl } = song;
  return (
    <Card sx={{ borderRadius: 2, textAlign: "left" }}>
      <CardMedia
        src={art ? URL.createObjectURL(art) : null}
        component="img"
        height={140}
        sx={{
          backgroundColor: theme.palette.secondary.light,
        }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name || "-"}
        </Typography>
        <Typography variant="body2">
          {`${!!editions ? editions : "-"}/${
            !!editions ? editions : "-"
          } remaining`}
        </Typography>
        <Grid container item justifyContent={"center"} mt={"1rem"}>
          <figure style={{ margin: 0, width: "100%" }}>
            <audio
              controls
              src={tmpAudioUrl}
              style={{ display: "block", width: "100%" }}
            >
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </figure>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container justifyContent={"center"}>
          <Button variant="contained" size="large" fullWidth disabled>
            Mint
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default SongCardPreview;
