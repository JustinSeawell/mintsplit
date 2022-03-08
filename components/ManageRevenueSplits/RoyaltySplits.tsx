import { Alert, Button, Divider, Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AddressListItem } from "../../types/AddressListItem";
import { RevenueSplitConfig } from "../../types/RevenueSplitConfig";
import RevenueSplitInput from "./RevenueSplitInput";
import { cloneRevenueSplitConfig } from "./cloneRevenueSplit";
import { MAX_ROYALTY_PERCENTAGE } from "./config";

interface RoyaltySplitsProps {
  revenueSplitConfigs: RevenueSplitConfig[];
  setRevenueSplitConfigs: Dispatch<SetStateAction<RevenueSplitConfig[]>>;
  addressListItems: AddressListItem[];
}

function RoyaltySplits({
  revenueSplitConfigs,
  setRevenueSplitConfigs,
  addressListItems,
}: RoyaltySplitsProps) {
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
          Secondary Sale (Royalties)
        </Typography>
        <Typography variant="body1">
          When a fan purchases your NFT on a secondary market you can take a
          percent of royalties on that sale. Be careful! You&apos;re taking a
          cut of your fan&apos;s sale profits, so you don&apos;t want to take
          too much.
        </Typography>
        <Alert severity="info" sx={{ textAlign: "left", marginTop: "1rem" }}>
          Some secondary NFT markets will <strong>ignore</strong> your royalty
          splitting rules! We recommend the following secondary markets:
          <Grid container mt={"1rem"}>
            <Button
              variant="outlined"
              color="info"
              href="https://zora.co"
              size="small"
              target={"_blank"}
              sx={{ marginRight: ".75rem" }}
            >
              Zora
            </Button>
            <Button
              variant="outlined"
              color="info"
              href="https://rarible.com"
              size="small"
              target={"_blank"}
            >
              Rarible
            </Button>
          </Grid>
        </Alert>
      </Grid>
      {revenueSplitConfigs.map((revenueSplitConfig, index) => (
        <Grid key={index} container>
          <RevenueSplitInput
            index={index}
            revenueSplitConfig={revenueSplitConfig} // one per song
            setRevenueSplitConfig={setRevenueSplitConfig}
            addressListItems={addressListItems}
            maxSplit={MAX_ROYALTY_PERCENTAGE}
            buttonText="+ Add Royalty Split"
          />
        </Grid>
      ))}

      <Divider sx={{ width: "100%", marginTop: "1rem" }} />
    </Grid>
  );
}

export default RoyaltySplits;
