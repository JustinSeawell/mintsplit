import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import useContentData from "../hooks/useContentData";
import theme from "../theme";

interface NFTCardProps {
  contractAddress: string;
  contentId: number;
  qty?: number;
  disabled?: boolean;
  handleQtyChange: (id: number, amount: number) => void;
}

function NFTCard({
  contractAddress,
  contentId,
  qty,
  disabled,
  handleQtyChange,
}: NFTCardProps) {
  const { data } = useContentData(contractAddress, contentId); // TODO: Use new content hook
  const { supply, limit, content } = { ...data };
  const { name, image, audio } = { ...content };

  const handleChange = (newAmount: number) => {
    handleQtyChange(contentId, newAmount);
  };

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
                value={qty ?? ""}
                InputProps={{
                  inputMode: "numeric",
                  inputProps: { min: 0 },
                }}
                onChange={(e) => handleChange(parseInt(e.target.value))}
                disabled={disabled}
              />
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
}

export default NFTCard;
