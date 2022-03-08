import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  TextField,
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
          {`Minted ${!!editions ? 0 : "-"}/${!!editions ? editions : "-"}`}
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
        <Grid mt={"2rem"}>
          <TextField
            id="cost-per-mint"
            label="Mint Amount"
            helperText="Choose how many you want to mint."
            variant="outlined"
            type={"number"}
            fullWidth
            value={0}
            disabled
          />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SongCardPreview;
