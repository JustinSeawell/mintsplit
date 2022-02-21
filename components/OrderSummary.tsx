import { Box, Grid, Typography } from "@mui/material";

interface OrderSummaryProps {
  fee: string;
}

function OrderSummary({ fee }: OrderSummaryProps) {
  return (
    <Box
      textAlign={"left"}
      bgcolor={"#F5F5F5"}
      p={"1rem"}
      borderRadius={2}
      width={"100%"}
    >
      <Typography fontWeight={600} mb={".5rem"}>
        Total Cost
      </Typography>
      <Typography fontSize={"1.5rem"} fontWeight={300}>
        Total: {fee} Ξ (+ gas)
      </Typography>
      <Typography variant="caption">
        This is the cost to deploy your NFT project to the blockchain.
      </Typography>
    </Box>
  );
}

export default OrderSummary;
