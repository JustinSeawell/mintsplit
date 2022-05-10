import { formatEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useState } from "react";
import { MintSplitERC721 } from "../../contracts/types";
import useETHBalance from "../../hooks/useETHBalance";
import theme from "../../theme";

interface WithdrawLeftoversProps {
  contract: MintSplitERC721;
  contractAddress: string;
  totalBalance: BigNumber;
}

function WithdrawLeftovers({
  contract,
  contractAddress,
  totalBalance,
}: WithdrawLeftoversProps) {
  const { account } = useWeb3React();
  const { data: ethBalance } = useETHBalance(contractAddress);
  const leftover = ethBalance?.sub(totalBalance);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      await contract.withdraw({ from: account });
      setSuccess(true);
    } catch (err) {
      // TODO: Report to sentry
    }

    setLoading(false);
  };

  // TODO: Display current balance

  return (
    <>
      <Grid mb={"1.5rem"}>
        <Typography
          variant="h6"
          color={theme.palette.primary.light}
          mr={".5rem"}
        >
          Withdraw Remaining Funds: Ξ {formatEther(leftover)}
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.grey[600]}
          gutterBottom
        >
          Withdraw contract funds that are NOT partitioned for splits with
          collaborators.
        </Typography>
      </Grid>
      <Grid container>
        <LoadingButton
          variant="contained"
          color="secondary"
          loading={loading}
          onClick={handleClick}
          sx={{ mr: "1rem" }}
        >
          Withdraw
        </LoadingButton>
        {success && (
          <Grid item>
            <Alert variant="outlined" severity="success">
              Funds withdrawn.
            </Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default WithdrawLeftovers;
