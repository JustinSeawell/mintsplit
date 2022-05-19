import { DatePicker, LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useProject } from "../../contexts/Project";
import { track } from "../../utils/track";
import { ProjectInputError, validate } from "../../validation/project";
import SetupNav from "../SetupNav";

interface ManageProjectProps {
  onSuccess: () => void;
  handleBack: () => void;
}

function ManageProject({ onSuccess, handleBack }: ManageProjectProps) {
  const { project, setProject } = useProject();
  const { name, symbol, description, artistName, mintCost, releaseDate } =
    project;
  const [inputError, setInputError] = useState<ProjectInputError>({});

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProject = { ...project, name: e.target.value };
    setProject(newProject);
    setInputError(validate(newProject, "name"));
  };

  const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProject = { ...project, symbol: e.target.value };
    setProject(newProject);
    setInputError(validate(newProject, "symbol"));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProject = { ...project, description: e.target.value };
    setProject(newProject);
    setInputError(validate(newProject, "description"));
  };

  const handleArtistNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProject = { ...project, artistName: e.target.value };
    setProject(newProject);
    setInputError(validate(newProject, "artistName"));
  };

  const handleNext = () => {
    const newError = validate(project);

    if (Object.keys(newError).length > 0) {
      setInputError(newError);
      return;
    }
    track("added project details");
    onSuccess();
  };

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
                onChange={handleNameChange}
                error={!!inputError?.name}
                helperText={inputError?.name}
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Symbol"
                variant="outlined"
                fullWidth
                value={symbol}
                onChange={handleSymbolChange}
                InputProps={{
                  inputProps: { style: { textTransform: "uppercase" } },
                }}
                error={!!inputError?.symbol}
                helperText={inputError?.symbol}
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
            onChange={handleDescriptionChange}
            error={!!inputError?.description}
            helperText={inputError?.description}
          />
          <Grid container>
            <Grid item xs={9} mr={"1rem"}>
              <TextField
                label="Artist Name"
                variant="outlined"
                fullWidth
                value={artistName}
                onChange={handleArtistNameChange}
                error={!!inputError?.artistName}
                helperText={inputError?.artistName}
              />
            </Grid>
            <Grid item xs>
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
        <SetupNav
          handleNext={handleNext}
          handleBack={handleBack}
          nextDisabled={Object.keys(inputError).length > 0}
        />
      </Grid>
    </>
  );
}

export default ManageProject;
