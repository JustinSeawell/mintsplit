import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import theme from "../../theme";
import { shortenHex } from "../../util";

interface AddressListProps {}

function AddressList({}: AddressListProps) {
  const { account } = useWeb3React();
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const { addresses, setAddresses } = useRevenueSplits();

  useEffect(() => {
    if (account && addresses.length == 0) {
      setAddresses([account, ...addresses]);
    }
  });

  const clearInputs = () => {
    setAddress("");
  };

  const handleAddressSubmit = () => {
    setAddresses([...addresses, address]);
    clearInputs();
  };

  useEffect(() => {
    if (address.length == 0) {
      setAddressError("");
      return;
    }

    setAddressError(!isAddress(address) ? "Please enter a valid address" : "");

    const isDuplicateAddr = (address: string) => addresses.includes(address);

    if (isDuplicateAddr(address))
      setAddressError("Duplicate addresses not allowed");
  }, [address, addresses]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <TextField
              label="Address"
              helperText={
                !!addressError
                  ? addressError
                  : "ex: 0x4342BB07A9094De14aA9e37Ab7cd1DeE552AEd30"
              }
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!addressError}
            />
            <Button
              variant="outlined"
              onClick={handleAddressSubmit}
              disabled={!!addressError || address.length == 0}
            >
              + Add Address
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            {addresses.length <= 0 && (
              <Typography variant="body1" color={theme.palette.grey[500]}>
                Enter an address to setup revenue splitting.
              </Typography>
            )}
            {addresses.length > 0 &&
              addresses.map((address, index) => (
                <Box
                  key={`addr-${index}`}
                  sx={{
                    backgroundColor: theme.palette.grey.A100,
                    borderRadius: 2,
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  {account == address && (
                    <Typography variant="subtitle1">
                      <strong>You</strong>
                    </Typography>
                  )}
                  <Typography fontWeight={300}>
                    {shortenHex(address, 4)}
                  </Typography>
                </Box>
              ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default AddressList;
