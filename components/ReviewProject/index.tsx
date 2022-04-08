import { formatEther, parseEther } from "@ethersproject/units";
import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useSongs } from "../../contexts/Songs";
import usePackages from "../../hooks/usePackages";
import OrderSummary from "../OrderSummary";
import LaunchProject from "./LaunchProject";
import ProjectCard from "./ProjectCard";
import SongCard from "./SongCard";

function ReviewProject() {
  const { songs } = useSongs();
  const [loadingMessage, setLoadingMessage] = useState<string>(null);
  const { data: packages } = usePackages();
  const [package1] = packages ?? [];
  const { fee } = package1;

  if (loadingMessage)
    return (
      <>
        <Typography variant="h4" gutterBottom mb={"3rem"}>
          {loadingMessage}
        </Typography>
        <CircularProgress size={70} />
      </>
    );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Review & Launch
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Review your project settings and launch.
      </Typography>
      <Grid item mt={"2rem"} xs={10} marginX={"auto"}>
        <ProjectCard />
        {songs.map((song, index) => (
          <SongCard key={index} song={song} index={index} />
        ))}
      </Grid>
      <Grid container item xs={10} marginX={"auto"} mt={"2rem"}>
        <OrderSummary fee={formatEther(fee ?? 0)} />
        <LaunchProject
          deploymentFee={fee}
          setLoadingMessage={setLoadingMessage}
        />
      </Grid>
    </>
  );
}

export default ReviewProject;
