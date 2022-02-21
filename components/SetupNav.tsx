import { Button, Grid } from "@mui/material";
import { useRouter } from "next/dist/client/router";

interface SetupNavProps {
  nextRoute: string;
  nextText?: string;
  backText?: string;
}

function SetupNav({ nextRoute, nextText, backText }: SetupNavProps) {
  const router = useRouter();

  return (
    <Grid container item justifyContent={"space-between"}>
      <Button variant="outlined" color="primary" onClick={() => router.back()}>
        {backText ?? "Go Back"}
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={() => router.push(nextRoute)}
      >
        {nextText ?? "Next 👉"}
      </Button>
    </Grid>
  );
}

export default SetupNav;
