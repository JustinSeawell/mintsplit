import { CircularProgress, Typography } from "@mui/material";

interface LoadingMessageProps {
  message: string;
}

function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <>
      <Typography variant="h4" gutterBottom mb={"3rem"}>
        {message}
      </Typography>
      <CircularProgress size={70} />
    </>
  );
}

export default LoadingMessage;
