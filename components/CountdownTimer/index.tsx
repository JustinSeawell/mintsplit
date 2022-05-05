import { Typography } from "@mui/material";
import { formatDuration, Interval, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  releaseTime: number; // In *seconds* since epoch
}

function CountdownTimer({ releaseTime }: CountdownTimerProps) {
  const [remainingInterval, setRemainingInterval] = useState<Interval>(null);

  useEffect(() => {
    const releaseDate = new Date(releaseTime * 1000);

    let oncePerSecond = setInterval(() => {
      const interval = {
        start: new Date(),
        end: releaseDate,
      } as Interval;

      setRemainingInterval(interval);
    }, 1000);

    return () => {
      clearInterval(oncePerSecond);
    };
  }, [releaseTime]);

  return (
    <>
      <Typography variant="subtitle1">Minting starts in:</Typography>
      {remainingInterval && (
        <Typography variant="h4" gutterBottom mb={"2rem"}>
          {formatDuration(intervalToDuration(remainingInterval))}
        </Typography>
      )}
    </>
  );
}

export default CountdownTimer;
