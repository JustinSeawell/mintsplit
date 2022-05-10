import { Button, Grid, TextField } from "@mui/material";

interface AddCollaboratorProps {
  address: string;
  error?: string;
  handleChange: (address: string) => void;
  handleClick: () => void;
}

function AddCollaborator({
  address,
  error,
  handleChange,
  handleClick,
}: AddCollaboratorProps) {
  return (
    <Grid container mb={".75rem"}>
      <Grid item xs={7} mr={"1rem"}>
        <TextField
          label="Address"
          value={address}
          fullWidth
          size="small"
          InputProps={{
            style: {
              backgroundColor: "#fff",
            },
          }}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error ?? ""}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="outlined"
          size="medium"
          onClick={handleClick}
          disabled={!!error || !address}
        >
          Add Collaborator
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddCollaborator;
