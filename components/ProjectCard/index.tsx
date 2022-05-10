import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import useCollectionData from "../../hooks/useCollectionData";

interface ProjectCardProps {
  address: string;
}

function ProjectCard({ address }: ProjectCardProps) {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data } = useCollectionData(address);
  const { params } = { ...data };
  const { name } = { ...params };

  if (!data)
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" sx={{ mb: "1rem" }} />
          <CardActions>
            <Skeleton variant="text" width={"10%"} />
            <Skeleton variant="text" width={"10%"} />
            <Skeleton variant="text" width={"10%"} />
          </CardActions>
        </CardContent>
      </Card>
    );

  return (
    <Card sx={{ textAlign: "left" }}>
      <CardContent>
        <Typography variant="h5">{name}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => router.push(`/project?cid=${address}`)}>
          Manage
        </Button>
        <Button onClick={() => router.push(`/collection?cid=${address}`)}>
          View
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.host}/collection?cid=${address}`
            );
            setSnackbarOpen(true);
          }}
        >
          Share
        </Button>
      </CardActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Link Copied"
        onClose={() => setSnackbarOpen(false)}
      />
    </Card>
  );
}

export default ProjectCard;
