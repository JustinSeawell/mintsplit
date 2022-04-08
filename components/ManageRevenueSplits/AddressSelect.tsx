import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { AddressListItem } from "../../types/AddressListItem";
import { shortenHex } from "../../util";

interface AddressSelectProps {
  index: number;
  address: string;
  addresses: string[];
  handleChange: (newAddress: string, index: number) => void;
  error: boolean;
}

function AddressSelect({
  index,
  addresses,
  address,
  handleChange,
  error,
}: AddressSelectProps) {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel id={`address-for-content-${index}`}>Address</InputLabel>
      <Select
        labelId={`address-for-content-${index}`}
        id={`address-select-${index}`}
        label="Address"
        sx={{ backgroundColor: "#fff" }}
        value={address}
        onChange={(e) => handleChange(e.target.value, index)}
      >
        {addresses.map((address, index) => (
          <MenuItem key={`addr-${index}`} value={address}>
            <Typography>{address}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AddressSelect;
