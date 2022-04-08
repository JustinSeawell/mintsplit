import { Grid, Typography } from "@mui/material";
import { PaymentSplitConfigStruct } from "../../contracts/types/RevenueSplitter";
import RevenueSplitInput from "./RevenueSplitInput";

interface MintSplitsProps {
  splitConfigs: PaymentSplitConfigStruct[];
}

function MintSplits({ splitConfigs }: MintSplitsProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={8} textAlign={"center"}>
        <Typography variant="h6" gutterBottom>
          Primary Sale (Mints)
        </Typography>
        <Typography variant="body1">
          When a fan mints your NFT on MintSplit 100% of the profits go to
          you... unless you decide to split the revenue with other people.
        </Typography>
      </Grid>
      {splitConfigs.map((config, index) => (
        <Grid key={index} container item xs={10} mt={"1.5rem"}>
          <RevenueSplitInput
            index={index}
            name={"Default Mint Split"}
            description={
              "The default revenue split for minting all NFTs in this project."
            }
            buttonText={"+ Add Mint Split"}
            splitConfig={config}
          />
        </Grid>
      ))}

      {/* <Divider sx={{ width: "100%", marginTop: "1rem" }} /> */}
    </Grid>
  );
}

export default MintSplits;
