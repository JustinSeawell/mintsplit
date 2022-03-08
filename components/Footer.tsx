import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled("footer")({
  margin: "2rem auto",
  textAlign: "center",
});

// TODO: Update to dynamic year
export default function Footer() {
  return (
    <StyledFooter>
      <Typography fontWeight={300} fontSize={13}>
        © MintSplit 2022
      </Typography>
    </StyledFooter>
  );
}
