import { Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AddressListItem } from "../../types/AddressListItem";
import AddressList from "./AddressList";

interface AddressesProps {
  addressListItems: AddressListItem[];
  setAddressListItems: Dispatch<SetStateAction<AddressListItem[]>>;
}

function Addresses({ addressListItems, setAddressListItems }: AddressesProps) {
  return (
    <Grid item xs={10}>
      <Typography variant="h6" gutterBottom>
        Addresses
      </Typography>
      <Typography variant="body1" gutterBottom>
        These are the Ethereum addresses that you want to split your revenue
        with.
      </Typography>
      <Grid mt={"2rem"}>
        <AddressList
          addresses={addressListItems}
          setAddresses={setAddressListItems}
        />
      </Grid>
    </Grid>
  );
}

export default Addresses;
