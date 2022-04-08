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
import theme from "../../theme";

import AddressSelect from "./AddressSelect";
import { convertToBps, convertToPercentage } from "./convertToBps";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Flag from "@mui/icons-material/Flag";
import { PaymentSplitConfigStruct } from "../../contracts/types/RevenueSplitter";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { clonePaymentSplitConfig } from "./clonePaymentSplitConfig";
import { BigNumber } from "ethers";

interface RevenueSplitInputProps {
  index: number;
  name: string;
  buttonText?: string;
  description?: string;
  splitConfig: PaymentSplitConfigStruct;
}

function RevenueSplitInput({
  index,
  name,
  buttonText,
  description,
  splitConfig,
}: RevenueSplitInputProps) {
  const { split, contentId } = splitConfig;
  const { recipients, bps } = split;
  const {
    addresses,
    mintSplits,
    royaltySplits,
    setMintSplits,
    setRoyaltySplits,
  } = useRevenueSplits();
  const allAddressesInUse = recipients.length == addresses.length;
  const isDefault = contentId === 0;
  const isLastDefaultSplit = isDefault && recipients.length == 1;
  // const [isValidSplit, setIsValidSplit] = useState(false);
  // const [invalidAddresses, setInvalidAddresses] = useState(false);
  // const allAddressesInUse = splits.length >= addressListItems.length;

  const handleAddressChange = (newAddress: string, splitIndex: number) => {
    // const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
    // clonedConfig.splits[splitIndex].recipient = newAddress;
    // setRevenueSplitConfig(clonedConfig, index);
  };

  // const handleSharesChange = (newShares: number, splitIndex: number) => {
  //   if (newShares === NaN) return;

  //   const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
  //   clonedConfig.splits[splitIndex].bps = convertToBps(newShares);
  //   setRevenueSplitConfig(clonedConfig, index);
  // };

  const setSplitConfig = (
    newConfig: PaymentSplitConfigStruct,
    index: number
  ) => {
    const { isMint } = newConfig;
    const configs = isMint ? mintSplits : royaltySplits;
    const newConfigs = configs.map((oldConfig) =>
      clonePaymentSplitConfig(oldConfig)
    );
    newConfigs[index] = newConfig;

    isMint ? setMintSplits(newConfigs) : setRoyaltySplits(newConfigs);
  };

  const findRemainingAddress = () =>
    addresses.find((address) => !recipients.includes(address));

  const addSplit = () => {
    const address = findRemainingAddress();
    const clonedConfig = clonePaymentSplitConfig(splitConfig);
    clonedConfig.split.recipients.push(address);
    clonedConfig.split.bps.push(BigNumber.from(0));
    setSplitConfig(clonedConfig, index);
  };

  // const removeSplit = (splitIndex: number) => {
  //   const clonedConfig = cloneRevenueSplitConfig(revenueSplitConfig);
  //   clonedConfig.splits.splice(splitIndex, 1);
  //   setRevenueSplitConfig(clonedConfig, index);
  // };

  // useEffect(() => {
  //   if (!maxSplit) return;

  //   const sharesNotGreaterThanMax = (splits: RevenueSplit[]) =>
  //     splits.map(({ bps }) => bps).reduce((sum, bps) => sum + bps, 0) <=
  //     convertToBps(maxSplit);

  //   setIsValidSplit(sharesNotGreaterThanMax(splits));
  // }, [maxSplit, splits]);

  // useEffect(() => {
  //   if (!requiredSplit) return;

  //   const sharesEqualToRequired = (splits: RevenueSplit[]) =>
  //     splits.map(({ bps }) => bps).reduce((sum, bps) => sum + bps, 0) ===
  //     convertToBps(requiredSplit);

  //   setIsValidSplit(sharesEqualToRequired(splits));
  // }, [requiredSplit, splits]);

  // useEffect(() => {
  //   const hasDupAddresses = (splits: RevenueSplit[]) =>
  //     splits.filter(
  //       ({ recipient }, index) =>
  //         splits
  //           .map(({ recipient: recipient2 }) => recipient2)
  //           .indexOf(recipient) !== index
  //     ).length > 0;

  //   setInvalidAddresses(hasDupAddresses(splits));
  // }, [maxSplit, splits]);

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
        <Stack spacing={3}>
          <Grid item>
            <Grid container>
              <Typography
                variant="h6"
                color={theme.palette.primary.light}
                gutterBottom
                mr={".5rem"}
              >
                {name}
              </Typography>
              {isDefault && <Flag color={"disabled"} />}
            </Grid>
            {description && (
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  color={theme.palette.grey[600]}
                  gutterBottom
                >
                  {description}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container item>
            <Button
              variant="outlined"
              disabled={allAddressesInUse}
              onClick={addSplit}
              sx={{ marginRight: "1rem" }}
            >
              {buttonText ?? "+ Add Revenue Split"}
            </Button>
            {allAddressesInUse && (
              <Alert severity="warning">
                Add an address above to enable splitting
              </Alert>
            )}
          </Grid>
          {recipients.map((address, splitIndex) => (
            <Grid key={`split-${splitIndex}`} container>
              <Grid item xs mr={"1rem"}>
                <AddressSelect
                  index={splitIndex}
                  address={address}
                  addresses={addresses}
                  handleChange={handleAddressChange}
                  error={false}
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
                  value={
                    isNaN(bps[splitIndex] as number)
                      ? ""
                      : convertToPercentage(bps[splitIndex] as number).toFixed(
                          0
                        )
                  }
                  // onChange={
                  // (e) =>
                  // handleSharesChange(parseInt(e.target.value), splitIndex)
                  // }
                  // error={!isValidSplit}
                />
                {/* {bps[splitIndex].toString()} */}
              </Grid>
              <Grid container item xs={1}>
                <Button
                  // onClick={() => removeSplit(splitIndex)}
                  disabled={isLastDefaultSplit}
                >
                  <DeleteForever
                    color={isLastDefaultSplit ? "disabled" : "action"}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
          {/* <Typography variant="h6" color={theme.palette.primary.light}>
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
              <Alert severity="warning">
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
          )} */}
        </Stack>
      </Box>
    </>
  );
}

export default RevenueSplitInput;
