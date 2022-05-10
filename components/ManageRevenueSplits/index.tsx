import {
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { SyntheticEvent, useState } from "react";
import { PaymentSplitStructOutput } from "../../contracts/types/MintSplitERC721";
import GreyBox from "../GreyBox";
import ContentSplits from "./ContentSplits";

interface ManageRevenueSplitProps {
  contractAddress: string;
  ownerAddress: string;
  editions: BigNumber[];
}

function ManageRevenueSplits({
  contractAddress,
  ownerAddress,
  editions,
}: ManageRevenueSplitProps) {
  const [tab, setTab] = useState(0);

  const handleChange = (
    e: SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setTab(newValue);
  };

  /**
   * TODO: lift state so that it doesn't clear when switching tabs
   */

  return (
    <>
      <Grid container justifyContent={"center"}>
        <Tabs centered value={tab} onChange={handleChange}>
          <Tab label="Primary Sales (Mint)" />
          <Tab label="Secondary Sales (Royalty)" />
        </Tabs>
      </Grid>
      <Grid container>
        {tab == 0 && (
          <>
            {editions?.map((edition, i) => (
              <Grid
                key={`mint-split-${i}`}
                container
                item
                xs={12}
                lg={10}
                marginX={"auto"}
                mt={"1rem"}
              >
                <GreyBox>
                  <ContentSplits
                    id={i + 1}
                    contractAddress={contractAddress}
                    ownerAddress={ownerAddress}
                    isMint
                  />
                </GreyBox>
              </Grid>
            ))}
          </>
        )}
        {tab == 1 && (
          <>
            {editions?.map((edition, i) => (
              <Grid
                key={`royalty-split-${i}`}
                container
                item
                xs={12}
                lg={10}
                marginX={"auto"}
                mt={"1rem"}
              >
                <GreyBox>
                  <ContentSplits
                    id={i + 1}
                    contractAddress={contractAddress}
                    ownerAddress={ownerAddress}
                  />
                </GreyBox>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  );
}

export default ManageRevenueSplits;
