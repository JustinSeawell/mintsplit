import {
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

interface SpaceCardProps {
  used: number;
  limit: number;
}

const getSpace = (used: number, limit: number) =>
  !used || !limit ? 0 : (used / limit) * 100;

function SpaceCard({ used = 0, limit = 0 }: SpaceCardProps) {
  const maxedOut = used > limit;
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Space
        </Typography>
        {maxedOut && (
          <Alert severity="error" sx={{ mb: "1rem" }}>
            Not enough space.
          </Alert>
        )}
        <Grid item xs={10}>
          <LinearProgress
            variant="determinate"
            color={maxedOut ? "error" : "secondary"}
            value={maxedOut ? 100 : getSpace(used, limit)}
            sx={{ mb: ".5rem" }}
          />
        </Grid>
        <Typography variant="caption">
          {used} of {limit} NFTs used
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SpaceCard;
