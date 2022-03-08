import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useContentData from "../hooks/useContentData";
import theme from "../theme";

interface NFTCardProps {
  contractAddress: string;
  contentId: number;
  handleQtyChange: (id: number, amount: number) => void;
}

function NFTCard({
  contractAddress,
  contentId,
  handleQtyChange,
}: NFTCardProps) {
  const { data } = useContentData(contractAddress, contentId);
  const { supply, limit, content } = { ...data };
  const { name, image, audio } = { ...content };
  const [amount, setAmount] = useState<number>(0);

  const handleChange = (newAmount: number) => {
    setAmount(newAmount);
    handleQtyChange(contentId, newAmount);
  };

  // TODO: Add content media

  return (
    <Card sx={{ borderRadius: 2, textAlign: "left" }}>
      {!data && (
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          height={250}
        >
          <CircularProgress />
        </Grid>
      )}
      {data && (
        <>
          <CardMedia
            src={image}
            component="img"
            height={240}
            sx={{
              backgroundColor: theme.palette.secondary.light,
            }}
          />
          <CardContent>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" gutterBottom>
              Minted {supply.toNumber()} / {limit.toNumber()}
            </Typography>
            <Grid container item justifyContent={"center"} mt={"1rem"}>
              <figure style={{ margin: 0, width: "100%" }}>
                <audio
                  controls
                  src={audio}
                  style={{ display: "block", width: "100%" }}
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </figure>
            </Grid>
            <Grid mt={"2rem"}>
              <TextField
                id="cost-per-mint"
                label="Mint Amount"
                helperText="Choose how many you want to mint."
                variant="outlined"
                type={"number"}
                fullWidth
                value={amount}
                InputProps={{
                  inputMode: "numeric",
                  inputProps: { min: 0 },
                }}
                onChange={(e) => handleChange(parseInt(e.target.value))}
              />
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
}

export default NFTCard;
