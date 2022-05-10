import { DeleteForever } from "@mui/icons-material";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

interface SplitRowProps {
  address: string;
  percentage?: number;
  disabled?: boolean;
  error?: string;
  handleChange?: (percentage: string) => void;
  handleDelete?: () => void;
}

function SplitRow({
  address,
  percentage,
  disabled,
  error,
  handleChange,
  handleDelete,
}: SplitRowProps) {
  return (
    <Grid container>
      <Grid item xs={7} mr={"1rem"}>
        <TextField value={address} fullWidth size="small" disabled />
      </Grid>
      <Grid item xs={3} mr={"1rem"}>
        <TextField
          value={isNaN(percentage) ? "" : percentage}
          fullWidth
          size="small"
          disabled={disabled}
          InputProps={{
            inputMode: "numeric",
            inputProps: { min: 0, max: 100 },
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            sx: { backgroundColor: disabled ? "" : "#fff" },
          }}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error ?? ""}
        />
      </Grid>
      {handleDelete && (
        <Grid item xs={1}>
          <Button onClick={handleDelete}>
            <DeleteForever color={"action"} />
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default SplitRow;
