import { Button, Grid } from "@mui/material";

interface SetupNavProps {
  handleNext: () => void;
  handleBack: () => void;
  nextText?: string;
  backText?: string;
  nextDisabled?: boolean;
}

function SetupNav({
  handleNext,
  handleBack,
  backText,
  nextText,
  nextDisabled,
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
        disabled={nextDisabled}
      >
        {nextText ?? "Next"}
      </Button>
    </Grid>
  );
}

export default SetupNav;
