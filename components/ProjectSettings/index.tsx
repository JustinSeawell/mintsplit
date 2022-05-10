import { Grid, Stack } from "@mui/material";
import { ParamsStructOutput } from "../../contracts/types/MintSplitERC721";
import useNFTContract from "../../hooks/useNFTContract";
import GreyBox from "../GreyBox";
import TogglePaused from "./TogglePaused";
import UpdateParams from "./UpdateParams";

interface ProjectSettingsProps {
  contractAddress: string;
  isPaused: boolean;
  params: ParamsStructOutput;
}

function ProjectSettings({
  contractAddress,
  isPaused,
  params,
}: ProjectSettingsProps) {
  const contract = useNFTContract(contractAddress);
  return (
    <Grid item xs>
      <Stack spacing={3}>
        <GreyBox>
          <TogglePaused contract={contract} isPaused={isPaused} />
        </GreyBox>
        <GreyBox>
          <UpdateParams contract={contract} params={params} />
        </GreyBox>
      </Stack>
    </Grid>
  );
}

export default ProjectSettings;
