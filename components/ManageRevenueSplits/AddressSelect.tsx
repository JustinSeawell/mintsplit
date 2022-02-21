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
  addressListItems: AddressListItem[];
  address: string;
  onAddressChange: (newAddress: string, index: number) => void;
  error: boolean;
}

function AddressSelect({
  index,
  addressListItems,
  address,
  onAddressChange,
  error,
}: AddressSelectProps) {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel id={`address-for-song-${index}`}>Address</InputLabel>
      <Select
        labelId={`address-for-song-${index}`}
        id={`address-select-${index}`}
        label="Address"
        sx={{ backgroundColor: "#fff" }}
        value={address}
        onChange={(e) => onAddressChange(e.target.value, index)}
      >
        {addressListItems.map(({ address, label }, index) => (
          <MenuItem key={`addr-item-${index}`} value={address}>
            <Typography component={"div"}>
              {label}{" "}
              <Typography
                display="inline"
                color={theme.palette.grey[600]}
                sx={{ marginLeft: ".25rem" }}
                fontWeight={300}
                fontSize={".9rem"}
              >
                ({shortenHex(address, 4)})
              </Typography>
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AddressSelect;
