import { parseEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, BigNumberish } from "ethers";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { defaultProject, useProject } from "../../contexts/Project";
import { useSongs } from "../../contexts/Songs";
import { ParamsStruct } from "../../contracts/types/MintSplitFactory";
import useETHBalance from "../../hooks/useETHBalance";
import useMintSplitFactory from "../../hooks/useMintSplitFactory";
import { uploadSongs } from "../../utils/upload";
import { getProjectCreated } from "./getProjectCreated";

interface LaunchProjectProps {
  deploymentFee?: BigNumber;
  setLoadingMessage: (msg: string) => void;
  tokens: number;
}

function LaunchProject({
  deploymentFee,
  setLoadingMessage,
  tokens,
}: LaunchProjectProps) {
  const router = useRouter();
  const { account, library, chainId } = useWeb3React();
  const { data: ethBalance } = useETHBalance(account);
  const isConnected = typeof account === "string" && !!library;
  const isOnNetwork = chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
  const [loading, setLoading] = useState(false);
  const mintSplitFactory = useMintSplitFactory();
  const { songs, setSongs } = useSongs();
  const [error, setError] = useState(false);
  const { project, setProject } = useProject();
  const [params, setParams] = useState<ParamsStruct>(null);

  const { name, symbol, mintCost, releaseDate } = project;

  const sufficientEth =
    !ethBalance || !deploymentFee ? false : ethBalance.gte(deploymentFee);

  const submitProject = async (
    _params: ParamsStruct,
    _editions: BigNumberish[]
  ) => {
    setLoadingMessage("Sending to the blockchain...");
    const trx = await mintSplitFactory.createProject(_params, _editions, {
      from: account,
      value: deploymentFee,
    });

    const receipt = await trx.wait();
    mixpanel.track("launched project", { content: _editions.length, tokens });
    const { args } = getProjectCreated(receipt);
    const [contractAddr] = args;

    router.push(`/project?cid=${contractAddr}&welcome=1`);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { dir } = await uploadSongs(songs, project);

      setLoadingMessage("Prepping your NFTs...");
      const _params = {
        name,
        symbol: symbol.toUpperCase(),
        baseURI: `ipfs://${dir}/`,
        mintPrice: parseEther(mintCost.toString()),
        releaseTime: Math.round(releaseDate.getTime() / 1000), // TODO: Test this
      } as ParamsStruct;

      await submitProject(
        _params,
        songs.map((s) => s.editions)
      );
    } catch (err) {
      // TODO: Report to sentry
      // TODO: Double check this pattern for errors
      console.error(err);
      setLoadingMessage(null);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ width: "100%", mt: "1.5rem" }}>
          There was an issue uploading your project. Please try again later.
        </Alert>
      )}
      {!sufficientEth && (
        <Alert severity="warning" sx={{ width: "100%", mt: "1.5rem" }}>
          Not enough ETH to launch this project.
        </Alert>
      )}
      <LoadingButton
        variant="contained"
        loading={loading}
        disabled={loading || !isConnected || !isOnNetwork || !sufficientEth} // TODO: Update this to check for mainnet
        color="secondary"
        component="span"
        fullWidth
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: 50,
        }}
        onClick={handleSubmit}
      >
        <Typography variant="h6">Launch My Project 🚀</Typography>
      </LoadingButton>
    </>
  );
}

export default LaunchProject;
