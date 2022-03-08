import { Button, Grid } from "@mui/material";

interface SetupNavProps {
  handleNext: () => void;
  handleBack: () => void;
  nextText?: string;
  backText?: string;
}

function SetupNav({
  handleNext,
  handleBack,
  backText,
  nextText,
}: SetupNavProps) {
  return (
    <Grid container item justifyContent={"space-between"}>
      <Button variant="outlined" color="secondary" onClick={handleBack}>
        {backText ?? "Go Back"}
      </Button>
      <Button
        variant="contained"
        size="large"
        color="secondary"
        onClick={handleNext}
      >
        {nextText ?? "Next"}
      </Button>
    </Grid>
  );
}

export default SetupNav;
