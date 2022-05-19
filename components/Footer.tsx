import { Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DISCORD_URL, TWITTER_URL } from "../constants";
import theme from "../theme";

const StyledFooter = styled("footer")({
  margin: "2rem auto 0 auto",
  padding: "4rem 6rem",
  textAlign: "center",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
});

export default function Footer() {
  return (
    <StyledFooter>
      <Container maxWidth="lg" disableGutters>
        <Grid container textAlign={"left"}>
          <Grid item xs={12} md={2} mb={"2rem"}>
            <Grid sx={{ width: "64px", height: "64px" }}>
              <img
                src="images/logo-opt.png"
                alt="mintsplit logo"
                srcSet=""
                width={"100%"}
                height={"auto"}
              />
            </Grid>
            <Typography fontWeight={300} fontSize={13}>
              © {new Date().getFullYear()} MintSplit
            </Typography>
          </Grid>
          <Grid item xs={0} md={2}></Grid>
          <Grid container item xs={12} md={8}>
            {/* <Grid item xs={3}>
              <Typography>Company</Typography>
            </Grid> */}
            {/* <Grid item xs={3}>
              <Typography>Support</Typography>
            </Grid> */}
            {/* <Grid item xs={3}>
              <Typography>Code</Typography>
            </Grid> */}
            <Grid item xs={3}>
              <Stack spacing={3}>
                <Typography fontWeight={500} fontSize={"1.25rem"}>
                  Socials
                </Typography>
                <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                  <Typography fontWeight={300} fontSize={"1rem"}>
                    Twitter
                  </Typography>
                </a>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                  <Typography fontWeight={300} fontSize={"1rem"}>
                    Discord
                  </Typography>
                </a>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
}
