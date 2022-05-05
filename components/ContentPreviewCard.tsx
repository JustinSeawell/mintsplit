import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import theme from "../theme";
import { Content } from "../types/Content";
import { ipfsToHttp } from "../util";
import Audio from "./Audio";

interface ContentPreviewCardProps {
  content: Content;
}

const getArtUrl = (content: Content) => {
  if (content?.artFile) return URL.createObjectURL(content?.artFile);
  return content?.artURI ? ipfsToHttp(content?.artURI) : null;
};

const getAudioUrl = (content: Content) => {
  if (content?.audioFile) return URL.createObjectURL(content?.audioFile);
  return content?.audioURI ? ipfsToHttp(content?.audioURI) : null;
};

function ContentPreviewCard({ content }: ContentPreviewCardProps) {
  const { name, editions } = { ...content };

  return (
    <Card sx={{ borderRadius: 2, textAlign: "left" }}>
      <CardMedia
        src={getArtUrl(content)}
        component={"img"}
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
          {`Minted 0 / ${!!editions ? editions : "-"}`}
        </Typography>
        <Grid container item justifyContent={"center"} mt={"1rem"}>
          <Audio src={getAudioUrl(content)} />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ContentPreviewCard;
