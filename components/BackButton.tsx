import { ArrowBackIos } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/dist/client/router";

interface BackButtonProps {
  override?: () => void;
}

function BackButton({ override }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button onClick={() => (override ? override() : router.back())}>
      <ArrowBackIos fontSize="small" />
      Back
    </Button>
  );
}

export default BackButton;
