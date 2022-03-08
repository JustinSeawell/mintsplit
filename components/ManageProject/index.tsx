import { DatePicker, LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useProject } from "../../contexts/Project";
import SetupNav from "../SetupNav";

interface ManageProjectProps {
  onSuccess: () => void;
  handleBack: () => void;
}

function ManageProject({ onSuccess, handleBack }: ManageProjectProps) {
  const { project, setProject } = useProject();
  const {
    name,
    symbol,
    description,
    artistName,
    mintCost,
    mintLimit,
    releaseDate,
  } = project;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Add Details
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Add details about your NFT project.
      </Typography>
      <Grid item xs={10} mt={"2rem"} marginX={"auto"}>
        <Stack spacing={3} width={"100%"}>
          <Grid container>
            <Grid item xs={9} mr={"1rem"}>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Symbol"
                variant="outlined"
                fullWidth
                value={symbol}
                onChange={(e) =>
                  setProject({ ...project, symbol: e.target.value })
                }
                InputProps={{
                  inputProps: { style: { textTransform: "uppercase" } },
                }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
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
            onChange={(e) =>
              setProject({ ...project, artistName: e.target.value })
            }
          />
          <Grid container>
            <Grid item xs mr={"1rem"}>
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
                  startAdornment: (
                    <InputAdornment position="start">Ξ</InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setProject({
                    ...project,
                    mintCost: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="mint-limit"
                label="Mint Limit (optional)"
                helperText="# of NFTs allowed to mint per wallet"
                variant="outlined"
                type={"number"}
                fullWidth
                value={mintLimit || ""}
                InputProps={{
                  inputMode: "numeric",
                  inputProps: { min: 0 },
                }}
                onChange={(e) =>
                  setProject({
                    ...project,
                    mintLimit: parseInt(e.target.value),
                  })
                }
              />
            </Grid>
          </Grid>
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
      </Grid>
      <Grid item xs={10} mt={"2rem"} marginX={"auto"}>
        <SetupNav handleNext={onSuccess} handleBack={handleBack} />
      </Grid>
    </>
  );
}

export default ManageProject;
