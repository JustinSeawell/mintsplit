import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { Song } from "../../types/Song";
import Image from "next/image";
import { shortenHex } from "../../util";

interface SongCardProps {
  song: Song;
  index: number;
}

function SongCard({ song, index }: SongCardProps) {
  const {
    name,
    editions,
    audio: { name: fileName },
    tmpAudioUrl,
    art,
  } = song;

  return (
    <Card
      sx={{
        width: "100%",
        textAlign: "left",
        padding: ".5rem 1rem",
        marginBottom: "1rem",
      }}
    >
      <CardContent>
        <Grid container item>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {name}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              color={theme.palette.grey[600]}
            >
              {fileName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {editions} editions
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
          </Grid>
          <Grid container item xs justifyContent={"end"}>
            <Box
              sx={{
                width: 160,
                height: 160,
                borderRadius: 2,
                backgroundColor: theme.palette.grey[500],
                overflow: "hidden",
              }}
              position={"relative"}
            >
              <img
                src={art ? URL.createObjectURL(art) : null}
                alt={name}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SongCard;
