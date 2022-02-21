import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled("footer")({
  marginTop: "2rem",
  padding: "2rem",
  textAlign: "center",
});

export default function Footer() {
  return (
    <StyledFooter>
      <Typography fontFamily={"monospace"} fontSize={13}>
        version 1.0
        <br /> CraftΞd with carΞ
        <br /> (Say hello on{" "}
        <a
          href={process.env.NEXT_PUBLIC_TWITTER_URL}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          twitter
        </a>
        )
      </Typography>
    </StyledFooter>
  );
}
