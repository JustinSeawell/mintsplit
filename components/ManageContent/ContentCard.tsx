import { BigNumber } from "@ethersproject/bignumber";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import useContent from "../../hooks/useContent";
import theme from "../../theme";

interface ContentCardProps {
  id: number;
  editions: BigNumber;
}

function ContentCard({ id, editions }: ContentCardProps) {
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const { data: content } = useContent(contractAddress, id);
  const isDeleted = editions?.isZero();

  if (!content)
    return (
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" height={200} sx={{ mb: "1rem" }} />
          <Skeleton variant="text" height={"3rem"} />
          <Skeleton variant="text" width={"30%"} />
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardMedia
        src={!isDeleted ? content?.artURI : ""}
        component="img"
        height={240}
        sx={{
          backgroundColor: theme.palette.secondary.light,
        }}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {content?.name}
        </Typography>
        {isDeleted && (
          <Typography variant="body1" color={"GrayText"}>
            (Deleted)
          </Typography>
        )}
        {!isDeleted && (
          <Typography variant="body1">
            Editions: {editions?.toNumber()}
          </Typography>
        )}
        {/* <Grid container item justifyContent={"center"} mt={"1rem"}>
          <Audio src={audio} />
        </Grid> */}
      </CardContent>
      <Divider sx={{ width: "100%" }} />
      <CardActions>
        <Button
          onClick={() => router.push(`/content?cid=${contractAddress}&c=${id}`)}
        >
          {!isDeleted ? "Edit" : "Restore"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ContentCard;
