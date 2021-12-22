import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled("footer")({
  padding: "1.5rem",
  textAlign: "center",
});

// TODO: Add twitter link
export default function Footer() {
  return (
    <StyledFooter>
      <Typography fontFamily={"monospace"} fontSize={13}>
        version 1.0
        <br /> CraftΞd with carΞ
        <br /> (Say hello on twitter)
      </Typography>
    </StyledFooter>
  );
}
