import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import useCollectionData from "../../hooks/useCollectionData";
import { formatEtherscanLink } from "../../util";

interface ProjectCardProps {
  address: string;
}

function ProjectCard({ address }: ProjectCardProps) {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data } = useCollectionData(address);
  const { name, totalSupply, totalSupplyLimit } = { ...data };

  if (!data) return <CircularProgress />;

  return (
    <Card sx={{ textAlign: "left" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Minted {totalSupply.toString()} / {totalSupplyLimit.toString()}
        </Typography>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          message="Link Copied"
          onClose={() => setSnackbarOpen(false)}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={
            () =>
              window.open(
                formatEtherscanLink("Account", [4, address]),
                "_blank"
              ) // TODO: Update for mainnet
          }
        >
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
    </Card>
  );
}

export default ProjectCard;
