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
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import theme from "../../theme";
import { Song } from "../../types/Song";
import Image from "next/image";
import { shortenHex } from "../../util";
import { convertToPercentage } from "../ManageRevenueSplits/convertToBps";

interface SongCardProps {
  song: Song;
  index: number;
}

function SongCard({ song, index }: SongCardProps) {
  const { mintSplits, royaltySplits } = useRevenueSplits();
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
        <Grid item mt={"2rem"}>
          <Typography variant="subtitle2" gutterBottom>
            Primary Sale (Mint) Splits
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Split %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mintSplits[index].splits.map(
                  ({ recipient, bps }, mintIndex) => (
                    <TableRow key={`mint-${mintIndex}`}>
                      <TableCell>{shortenHex(recipient, 4)}</TableCell>
                      <TableCell>{convertToPercentage(bps)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item mt={"2rem"}>
          <Typography variant="subtitle2" gutterBottom>
            Secondary Sale (Royalty) Splits
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Split %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {royaltySplits[index].splits.map(
                  ({ recipient, bps }, royaltyIndex) => (
                    <TableRow key={`royalty-${royaltyIndex}`}>
                      <TableCell>{shortenHex(recipient, 4)}</TableCell>
                      <TableCell>
                        {convertToPercentage(bps).toFixed(0)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SongCard;
