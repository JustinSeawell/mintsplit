import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  secondsRemaining: number;
}

const formatSeconds = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

function CountdownTimer({ secondsRemaining }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(secondsRemaining);

  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds == 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <>
      <Typography variant="subtitle1">Minting starts in:</Typography>
      <Typography variant="h3" gutterBottom>
        {formatSeconds(seconds)}
      </Typography>
    </>
  );
}

export default CountdownTimer;
