import { Grid, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import useProjectsByUser from "../../hooks/useProjectsByUser";

function Projects() {
  const { account } = useWeb3React();
  const factoryAddress = process.env.NEXT_PUBLIC_AUDIO_NFT_FACTORY_ADDRESS;
  const { data: projects } = useProjectsByUser(factoryAddress, account);

  return (
    <Stack spacing={3} alignItems={"center"}>
      <Grid container item xs={8}>
        <Typography variant="h2" fontWeight={600}>
          Your MintSplit projects 👇
        </Typography>
      </Grid>
    </Stack>
  );
}

export default Projects;
