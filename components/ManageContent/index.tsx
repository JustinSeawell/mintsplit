import { BigNumber } from "@ethersproject/bignumber";
import { LoadingButton } from "@mui/lab";
import { Divider, Grid } from "@mui/material";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/dist/client/router";
import ContentCard from "./ContentCard";

interface ManageContentProps {
  contractAddress: string;
  baseURI: string;
  editions: BigNumber[];
}

function ManageContent({
  contractAddress,
  editions,
  baseURI,
}: ManageContentProps) {
  const router = useRouter();

  const handleClick = () => {
    mixpanel.track("clicked add content");
    router.push(`/content?cid=${contractAddress}`);
  };

  return (
    <>
      <Grid container marginX={"auto"} justifyContent={"center"}>
        <Grid container mb={"2rem"}>
          <LoadingButton
            variant="contained"
            color="secondary"
            component="span"
            size="large"
            onClick={handleClick}
          >
            Add Content
          </LoadingButton>
        </Grid>
        <Grid container item spacing={3}>
          {editions &&
            editions.map((edition, i) => (
              <Grid key={"content-" + i} item xs={12} md={4}>
                <ContentCard id={i + 1} editions={edition} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );
}

export default ManageContent;
