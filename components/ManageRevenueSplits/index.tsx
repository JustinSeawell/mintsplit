import { Divider, Grid } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AddressListItem } from "../../types/AddressListItem";
import {
  RevenueSplit,
  RevenueSplitConfig,
} from "../../types/RevenueSplitConfig";
import { cloneRevenueSplitConfig } from "./cloneRevenueSplit";
import RevenueSplitInput from "./RevenueSplitInput";

interface ManageRevenueSplitProps {
  revenueSplitConfigs: RevenueSplitConfig[];
  setRevenueSplitConfigs: Dispatch<SetStateAction<RevenueSplitConfig[]>>;
  maxSplit?: number;
  requiredSplit?: number;
  addressListItems: AddressListItem[];
  buttonText?: string;
}

function ManageRevenueSplits({
  revenueSplitConfigs,
  setRevenueSplitConfigs,
  maxSplit,
  requiredSplit,
  addressListItems,
  buttonText,
}: ManageRevenueSplitProps) {
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
    <>
      {revenueSplitConfigs.map((revenueSplitConfig, index) => (
        <Grid key={index} container item mb={"1rem"}>
          <RevenueSplitInput
            index={index}
            revenueSplitConfig={revenueSplitConfig} // one per song
            setRevenueSplitConfig={setRevenueSplitConfig}
            addressListItems={addressListItems}
            maxSplit={maxSplit}
            requiredSplit={requiredSplit}
            buttonText={buttonText}
          />
        </Grid>
      ))}
      <Divider sx={{ width: "100%" }} />
    </>
  );
}

export default ManageRevenueSplits;
