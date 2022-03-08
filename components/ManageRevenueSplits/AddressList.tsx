import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import theme from "../../theme";
import { AddressListItem } from "../../types/AddressListItem";
import { shortenHex } from "../../util";

interface AddressListProps {
  addresses: AddressListItem[];
  setAddresses: Dispatch<SetStateAction<AddressListItem[]>>;
}

function AddressList({ addresses, setAddresses }: AddressListProps) {
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const clearInputs = () => {
    setLabel("");
    setAddress("");
  };

  const handleAddressSubmit = () => {
    // TODO: Add validation
    setAddresses([...addresses, { label, address } as AddressListItem]);
    clearInputs();
  };

  useEffect(() => {
    const isDuplicateAddr = (address: string) =>
      addresses.map(({ address }) => address).includes(address);

    setAddressError(isDuplicateAddr(address));
  }, [address, addresses]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              helperText="ex: your producer's name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <TextField
              label="Address"
              helperText={
                addressError
                  ? "Duplicate addresses not allowed"
                  : "ex: 0x4342BB07A9094De14aA9e37Ab7cd1DeE552AEd30"
              }
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={addressError}
            />
            <Button
              variant="outlined"
              onClick={handleAddressSubmit}
              disabled={addressError}
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
              addresses.map(({ label, address }, index) => (
                <Box
                  key={`addr-${index}`}
                  sx={{
                    backgroundColor: theme.palette.grey.A100,
                    borderRadius: 2,
                    padding: "1rem",
                  }}
                >
                  <Typography variant="subtitle1">
                    <strong>{label}</strong>
                  </Typography>
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
