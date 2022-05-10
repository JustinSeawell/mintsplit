import { formatEther } from "@ethersproject/units";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSongs } from "../../contexts/Songs";
import useTokenFee from "../../hooks/useTokenFee";
import BackButton from "../BackButton";
import LoadingMessage from "../LoadingMessage";
import OrderSummary from "../OrderSummary";
import LaunchProject from "./LaunchProject";
import ProjectCard from "./ProjectCard";
import SongCard from "./SongCard";

interface ReviewProjectProps {
  handleBack?: () => void;
}

function ReviewProject({ handleBack }: ReviewProjectProps) {
  const { songs } = useSongs();
  const [loadingMessage, setLoadingMessage] = useState<string>(null);
  const tokens = songs.reduce((sum, song) => (sum += song?.editions), 0);
  const { data: tokenFee } = useTokenFee(tokens);

  if (loadingMessage) return <LoadingMessage message={loadingMessage} />;

  return (
    <>
      <Grid
        container
        item
        xs={10}
        marginX={"auto"}
        justifyContent={"start"}
        mb={"1rem"}
      >
        <BackButton override={handleBack} />
      </Grid>
      <Typography variant="h4" gutterBottom>
        Review & Launch
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Review your project settings and launch.
      </Typography>
      {handleBack && (
        <Grid item xs={10} marginX={"auto"} mt={"1rem"} textAlign={"left"}>
          <Alert severity="info">
            <AlertTitle>Everything Look Good?</AlertTitle>
            It&apos;s cheaper to launch your project correctly the first time.
            Changing project settings later may require additional gas fees.
          </Alert>
        </Grid>
      )}
      <Grid item xs={10} marginX={"auto"} mt={"1rem"} textAlign={"left"}>
        <Alert severity="info">
          <AlertTitle>Revenue Splits</AlertTitle>
          You&apos;ll be able to add splits after project creation.
        </Alert>
      </Grid>
      <Grid item mt={"1rem"} xs={10} marginX={"auto"}>
        <ProjectCard />
        {songs.map((song, index) => (
          <SongCard key={index} song={song} index={index} />
        ))}
      </Grid>
      <Grid container item xs={10} marginX={"auto"} mt={"2rem"}>
        <OrderSummary fee={tokenFee ? formatEther(tokenFee) : ""} />
        <LaunchProject
          deploymentFee={tokenFee}
          setLoadingMessage={setLoadingMessage}
          tokens={tokens}
        />
      </Grid>
    </>
  );
}

export default ReviewProject;
