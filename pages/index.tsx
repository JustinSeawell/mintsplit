import { Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import Layout from "../components/Layout";

function Home() {
  const router = useRouter();
  return (
    <>
      <Layout title="Create Audio NFT Projects & Split Revenue with Collaborators">
        <section>
          <Stack spacing={3} alignItems="start">
            <Typography variant="h4">
              Create Audio NFT Projects & Split Revenue with Collaborators
            </Typography>
            <ul>
              <li>
                <Typography variant="subtitle1" textAlign={"left"}>
                  Sell audio NFTs
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle1" textAlign={"left"}>
                  Split primary & secondary NFT sales
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle1" textAlign={"left"}>
                  Own & manage your projects
                </Typography>
              </li>
            </ul>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ padding: "1rem 1.5rem" }}
              onClick={() => router.push("/setup")}
            >
              Start Creating
            </Button>
          </Stack>
        </section>
      </Layout>
    </>
  );
}

export default Home;
