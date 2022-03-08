import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSongs } from "../../contexts/Songs";
import theme from "../../theme";
import { AddressListItem } from "../../types/AddressListItem";
import {
  RevenueSplit,
  RevenueSplitConfig,
} from "../../types/RevenueSplitConfig";
import AddressSelect from "./AddressSelect";
import { cloneRevenueSplitConfig } from "./cloneRevenueSplit";
import { convertToBps, convertToPercentage } from "./convertToBps";
import DeleteForever from "@mui/icons-material/DeleteForever";

interface RevenueSplitInputProps {
  index: number;
  revenueSplitConfig: RevenueSplitConfig;
  setRevenueSplitConfig: (
    newRevenueSplit: RevenueSplitConfig,
    index: number
  ) => void;
  addressListItems: AddressListItem[];
  buttonText?: string;
  maxSplit?: number;
  requiredSplit?: number;
}

function RevenueSplitInput({
  index,
  revenueSplitConfig,
  setRevenueSplitConfig,
  addressListItems,
  buttonText,
  maxSplit,
  requiredSplit,
}: RevenueSplitInputProps) {
  const { songs } = useSongs();
  const { name, audio } = songs[index];
  const { name: fileName } = audio;
  const { splits } = revenueSplitConfig;
  const [isValidSplit, setIsValidSplit] = useState(false);
  const [invalidAddresses, setInvalidAddresses] = useState(false);
  const allAddressesInUse = splits.length >= addressListItems.length;

  const handleAddressChange = (newAddress: string, splitIndex: number) => {
    const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
    clonedConfig.splits[splitIndex].recipient = newAddress;
    setRevenueSplitConfig(clonedConfig, index);
  };

  const handleSharesChange = (newShares: number, splitIndex: number) => {
    if (newShares === NaN) return;

    const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
    clonedConfig.splits[splitIndex].bps = convertToBps(newShares);
    setRevenueSplitConfig(clonedConfig, index);
  };

  const findRemainingAddresses = () =>
    addressListItems.filter(
      ({ address }) =>
        !splits.map(({ recipient }) => recipient).includes(address)
    );

  const findRemainingAddress = () =>
    addressListItems.find(
      ({ address }) =>
        !splits.map(({ recipient }) => recipient).includes(address)
    );

  const addSplit = () => {
    const { address: recipient } = findRemainingAddress();
    const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
    clonedConfig.splits.push({ bps: 0, recipient });
    setRevenueSplitConfig(clonedConfig, index);
  };

  const removeSplit = (splitIndex: number) => {
    const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
    console.log(clonedConfig.splits);
    clonedConfig.splits.splice(splitIndex, 1);
    console.log(clonedConfig.splits);
    setRevenueSplitConfig(clonedConfig, index);
  };

  useEffect(() => {
    if (!maxSplit) return;

    const sharesNotGreaterThanMax = (splits: RevenueSplit[]) =>
      splits.map(({ bps }) => bps).reduce((sum, bps) => sum + bps, 0) <=
      convertToBps(maxSplit);

    setIsValidSplit(sharesNotGreaterThanMax(splits));
  }, [maxSplit, splits]);

  useEffect(() => {
    if (!requiredSplit) return;

    const sharesEqualToRequired = (splits: RevenueSplit[]) =>
      splits.map(({ bps }) => bps).reduce((sum, bps) => sum + bps, 0) ===
      convertToBps(requiredSplit);

    setIsValidSplit(sharesEqualToRequired(splits));
  }, [requiredSplit, splits]);

  useEffect(() => {
    const hasDupAddresses = (splits: RevenueSplit[]) =>
      splits.filter(
        ({ recipient }, index) =>
          splits
            .map(({ recipient: recipient2 }) => recipient2)
            .indexOf(recipient) !== index
      ).length > 0;

    setInvalidAddresses(hasDupAddresses(splits));
  }, [maxSplit, splits]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.grey.A100,
          width: "100%",
          height: "100%",
          borderRadius: 2,
          padding: "1rem 2rem",
          textAlign: "left",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" color={theme.palette.primary.light}>
            {name}
          </Typography>
          <Typography variant="body1" color={theme.palette.grey[600]}>
            {fileName}
          </Typography>
          <Grid container item pt={"1.25rem"}>
            <Button
              variant="outlined"
              disabled={allAddressesInUse}
              onClick={addSplit}
              sx={{ marginRight: "1rem" }}
            >
              {buttonText ?? "+ Add Revenue Split"}
            </Button>
            {allAddressesInUse && (
              <Alert severity="info">
                Add an address above to enable splitting
              </Alert>
            )}
          </Grid>
          {splits.map(({ recipient, bps }, splitIndex) => (
            <Grid key={splitIndex} item xs={12} container pt={".5rem"}>
              <Grid item xs mr={"1rem"}>
                <AddressSelect
                  index={splitIndex}
                  addressListItems={addressListItems}
                  address={recipient}
                  onAddressChange={handleAddressChange}
                  error={invalidAddresses}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Split"
                  variant="outlined"
                  type={"number"}
                  fullWidth
                  InputProps={{
                    inputMode: "numeric",
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#fff" }}
                  value={isNaN(bps) ? "" : convertToPercentage(bps).toFixed(0)}
                  onChange={(e) =>
                    handleSharesChange(parseInt(e.target.value), splitIndex)
                  }
                  error={!isValidSplit}
                />
              </Grid>
              <Grid container item xs={1}>
                <Button onClick={() => removeSplit(splitIndex)}>
                  <DeleteForever color="action" />
                </Button>
              </Grid>
            </Grid>
          ))}
          {!isValidSplit && (
            <Typography
              variant="caption"
              color={theme.palette.error.main}
              textAlign={"right"}
            >
              {requiredSplit
                ? `Combined split must equal ${requiredSplit}%`
                : `Combined split cannot be greater than ${maxSplit}%`}
            </Typography>
          )}
          {invalidAddresses && (
            <Typography
              variant="caption"
              color={theme.palette.error.main}
              textAlign={"left"}
            >
              Duplicate addresses not allowed
            </Typography>
          )}
        </Stack>
      </Box>
    </>
  );
}

export default RevenueSplitInput;
