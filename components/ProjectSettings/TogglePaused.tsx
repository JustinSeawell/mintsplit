import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { MintSplitERC721 } from "../../contracts/types";
import theme from "../../theme";

interface TogglePausedProps {
  contract: MintSplitERC721;
  isPaused: boolean;
}

function TogglePaused({ contract, isPaused }: TogglePausedProps) {
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const trx = await contract.togglePaused({ from: account });
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
          Contract {isPaused ? "is" : "is Not"} Paused
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.grey[600]}
          gutterBottom
        >
          {isPaused ? "Resume" : "Pause"} your contract. When your contract is
          paused no one will be able to mint.
        </Typography>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <LoadingButton
            variant="contained"
            color="secondary"
            loading={loading}
            onClick={handleClick}
          >
            {isPaused ? "Resume" : "Pause"} Contract
          </LoadingButton>
        </Grid>
        {success && (
          <Grid item>
            <Alert variant="outlined" severity="success">
              Contract paused state was updated.
            </Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default TogglePaused;
