import { DatePicker, LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Button, Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { useProject } from "../../contexts/Project";

interface ManageProjectProps {}

function ManageProject({}: ManageProjectProps) {
  const { project, setProject } = useProject();
  const {
    name = "",
    description = "",
    artistName = "",
    mintCost = 0.0,
    releaseDate = new Date(),
  } = project || {};

  return (
    <Stack spacing={3} width={"100%"}>
      <TextField
        label="Project Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setProject({ ...project, name: e.target.value })}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={description}
        onChange={(e) =>
          setProject({ ...project, description: e.target.value })
        }
      />
      <TextField
        label="Artist Name"
        variant="outlined"
        fullWidth
        value={artistName}
        onChange={(e) => setProject({ ...project, artistName: e.target.value })}
      />
      <TextField
        id="cost-per-mint"
        label="Mint Price"
        helperText="Price your fans pay to mint 1 NFT"
        variant="outlined"
        type={"number"}
        fullWidth
        value={mintCost || "0.00"}
        InputProps={{
          inputMode: "numeric",
          inputProps: { step: ".01", min: 0 },
          startAdornment: <InputAdornment position="start">Ξ</InputAdornment>,
        }}
        onChange={(e) =>
          setProject({ ...project, mintCost: parseFloat(e.target.value) })
        }
      />
      <Grid container item>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container item xs mr={"1rem"}>
            <DatePicker
              renderInput={(props) => (
                <TextField
                  fullWidth
                  helperText="The date your project will be available to mint."
                  {...props}
                />
              )}
              label="Release Date"
              value={releaseDate}
              onChange={(newRevealDateTime) => {
                setProject({ ...project, releaseDate: newRevealDateTime });
              }}
            />
          </Grid>
          <Grid container item xs>
            <TimePicker
              renderInput={(props) => (
                <TextField
                  fullWidth
                  helperText="The time your project will be available to mint."
                  {...props}
                />
              )}
              label="Release Time"
              value={releaseDate}
              onChange={(newRevealTime) => {
                const { releaseDate: prevDate } = { ...project };
                const newDate = new Date(prevDate.getTime());
                newDate.setHours(
                  newRevealTime.getHours(),
                  newRevealTime.getMinutes(),
                  newRevealTime.getSeconds()
                );
                setProject({ ...project, releaseDate: newDate });
              }}
            />
          </Grid>
        </LocalizationProvider>
      </Grid>
    </Stack>
  );
}

export default ManageProject;
