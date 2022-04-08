import { Grid, Typography } from "@mui/material";
import AddressList from "./AddressList";

function Addresses() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} textAlign={"center"}>
          <Typography variant="h6" gutterBottom>
            Addresses
          </Typography>
          <Typography variant="body1" gutterBottom>
            These are the Ethereum addresses that you want to split your revenue
            with.
          </Typography>
        </Grid>
        <Grid item xs={10} marginX={"auto"}>
          <AddressList />
        </Grid>
      </Grid>
    </>
  );
}

export default Addresses;
