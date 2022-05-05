import { Box } from "@mui/material";
import theme from "../theme";

function GreyBox({ children }) {
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey.A100,
        width: "100%",
        borderRadius: 2,
        padding: "1rem 1.5rem",
        textAlign: "left",
      }}
    >
      {children}
    </Box>
  );
}

export default GreyBox;
