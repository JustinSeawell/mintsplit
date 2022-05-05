import { formatEther, parseEther } from "@ethersproject/units";
import {
  DatePicker,
  LoadingButton,
  LocalizationProvider,
  TimePicker,
} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Alert,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { ChangeEvent, useState } from "react";
import {
  MintSplitERC721,
  ParamsStructOutput,
} from "../../contracts/types/MintSplitERC721";
import theme from "../../theme";

interface UpdateParamsProps {
  contract: MintSplitERC721;
  params: ParamsStructOutput;
}

function UpdateParams({ contract, params }: UpdateParamsProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [projectParams, setProjectParams] = useState<ParamsStructOutput>({
    ...params,
  });
  const { name, symbol, mintPrice, releaseTime } = { ...projectParams };
  const releaseDate = new Date(releaseTime?.toNumber() * 1000);

  const handleMintPriceChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isNaN(parseFloat(e.target.value))) return;

    setProjectParams({
      ...projectParams,
      mintPrice: parseEther(e.target.value),
    });
  };

  const handleDateChange = (newDate: Date) => {
    const seconds = newDate.getTime() / 1000;

    setProjectParams({
      ...projectParams,
      releaseTime: BigNumber.from(seconds),
    });
  };

  const handleTimeChange = (newDate: Date) => {
    const result = new Date(releaseDate.getTime());
    result.setHours(
      newDate.getHours(),
      newDate.getMinutes(),
      newDate.getSeconds()
    );

    const seconds = result.getTime() / 1000;

    setProjectParams({
      ...projectParams,
      releaseTime: BigNumber.from(seconds),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const trx = await contract.setParams(projectParams);
      await trx.wait();
      setSuccess(true);
    } catch (err) {
      // TODO: Report to sentry
    }

    setLoading(false);
  };

  return (
    <>
      <Grid mb={"1.5rem"}>
        <Typography
          variant="h6"
          color={theme.palette.primary.light}
          mr={".5rem"}
        >
          Project Details
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.grey[600]}
          gutterBottom
        >
          Update details about your project.
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={3}>
          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            disabled
            InputLabelProps={{ shrink: true }}
            value={name}
          />
          <TextField
            label="Symbol"
            variant="outlined"
            fullWidth
            disabled
            InputLabelProps={{ shrink: true }}
            value={symbol}
          />
          <TextField
            id="cost-per-mint"
            label="Mint Price"
            helperText="Price your fans pay to mint 1 NFT"
            variant="outlined"
            type={"number"}
            fullWidth
            value={formatEther(mintPrice) || "0.00"}
            InputProps={{
              inputMode: "numeric",
              inputProps: { step: ".01", min: 0 },
              style: { backgroundColor: "#fff" },
              startAdornment: (
                <InputAdornment position="start">Ξ</InputAdornment>
              ),
            }}
            onChange={handleMintPriceChange}
          />
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
                InputProps={{
                  style: { backgroundColor: "#fff" },
                }}
                onChange={handleDateChange}
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
                InputProps={{
                  style: { backgroundColor: "#fff" },
                }}
                onChange={handleTimeChange}
              />
            </Grid>
          </LocalizationProvider>
          <Grid container>
            <LoadingButton
              variant="contained"
              color="secondary"
              loading={loading}
              onClick={handleSubmit}
              sx={{ mr: "1rem" }}
            >
              Update Project Details
            </LoadingButton>
            {success && (
              <Alert variant="outlined" severity="success">
                Contract paused state was updated.
              </Alert>
            )}
          </Grid>
        </Stack>
      </Grid>
    </>
  );
}

export default UpdateParams;
