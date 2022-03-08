import { Divider, Grid, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AddressListItem } from "../../types/AddressListItem";
import { RevenueSplitConfig } from "../../types/RevenueSplitConfig";
import { cloneRevenueSplitConfig } from "./cloneRevenueSplit";
import RevenueSplitInput from "./RevenueSplitInput";
import { MAX_MINT_PERCENTAGE } from "./config";

interface MintSplitsProps {
  revenueSplitConfigs: RevenueSplitConfig[];
  setRevenueSplitConfigs: Dispatch<SetStateAction<RevenueSplitConfig[]>>;
  addressListItems: AddressListItem[];
}

function MintSplits({
  revenueSplitConfigs,
  setRevenueSplitConfigs,
  addressListItems,
}: MintSplitsProps) {
  const setRevenueSplitConfig = (
    newRevenueSplitConfig: RevenueSplitConfig,
    index: number
  ) => {
    const newConfigs = revenueSplitConfigs.map((oldConfig) =>
      cloneRevenueSplitConfig(oldConfig)
    );

    newConfigs[index] = newRevenueSplitConfig;
    setRevenueSplitConfigs(newConfigs);
  };

  return (
    <Grid item xs={10} container justifyContent={"center"}>
      <Grid item xs={10} mb={"2rem"}>
        <Typography variant="h6" gutterBottom>
          Primary Sale (Mints)
        </Typography>
        <Typography variant="body1">
          When a fan mints your NFT on MintSplit 100% of the profits go to
          you... unless you decide to split the revenue with other people.
        </Typography>
      </Grid>
      {revenueSplitConfigs.map((revenueSplitConfig, index) => (
        <Grid key={index} container>
          <RevenueSplitInput
            index={index}
            revenueSplitConfig={revenueSplitConfig} // one per song
            setRevenueSplitConfig={setRevenueSplitConfig}
            addressListItems={addressListItems}
            requiredSplit={MAX_MINT_PERCENTAGE}
            buttonText="+ Add Mint Split"
          />
        </Grid>
      ))}

      <Divider sx={{ width: "100%", marginTop: "1rem" }} />
    </Grid>
  );
}

export default MintSplits;
