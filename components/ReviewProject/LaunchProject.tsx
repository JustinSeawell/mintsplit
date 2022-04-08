import { parseEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { defaultProject, useProject } from "../../contexts/Project";
import { useRevenueSplits } from "../../contexts/RevenueSplit";
import { useSongs } from "../../contexts/Songs";
import { ProjectParamsStruct } from "../../contracts/types/MintSplitFactory";
import useETHBalance from "../../hooks/useETHBalance";
import useMintSplitFactory from "../../hooks/useMintSplitFactory";
import { getProjectCreated } from "./getProjectCreated";
import { uploadMetadata } from "./uploadMetadata";

interface LaunchProjectProps {
  deploymentFee: BigNumber;
  setLoadingMessage: (msg: string) => void;
}

function LaunchProject({
  deploymentFee,
  setLoadingMessage,
}: LaunchProjectProps) {
  const router = useRouter();
  const { account, library, chainId } = useWeb3React();
  const { data: ethBalance } = useETHBalance(account);
  const isConnected = typeof account === "string" && !!library;
  const isRinkeby = chainId === 4;
  const [loading, setLoading] = useState(false);
  const mintSplitFactory = useMintSplitFactory();
  const { setMintSplits, setRoyaltySplits } = useRevenueSplits();
  const { songs, setSongs } = useSongs();
  const [error, setError] = useState(false);
  const { project, setProject } = useProject();
  const [params, setParams] = useState<ProjectParamsStruct>(null);

  const {
    name: projectName,
    symbol,
    mintCost,
    mintLimit,
    releaseDate,
  } = project;

  const sufficientEth =
    !ethBalance || !deploymentFee ? false : ethBalance.gte(deploymentFee);

  const clearAppState = () => {
    setSongs([]);
    setProject({ ...defaultProject });
    setMintSplits([]);
    setRoyaltySplits([]);
  };

  const submitProject = async (_params: ProjectParamsStruct) => {
    setLoadingMessage("Sending to the blockchain...");
    const trx = await mintSplitFactory.createProject(_params, {
      from: account,
      value: deploymentFee,
    });

    const receipt = await trx.wait();
    const { args } = getProjectCreated(receipt);
    const [contractAddr] = args;

    clearAppState(); // TODO: Debug this
    router.push(`/project?cid=${contractAddr}&welcome=1`);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (params) {
        // TODO: Fix error here
        /**
         * If metadata is already uploaded then just submit
         * the project instead of re-uploading everything.
         */
        await submitProject(params);
        return;
      }

      const { dir } = await uploadMetadata(songs, project, setLoadingMessage);

      setLoadingMessage("Prepping your NFTs...");
      const _params = {
        projectName,
        symbol: symbol.toUpperCase(),
        contentCount: songs.length,
        editions: songs.map((s) => s.editions),
        mintPrice: parseEther(mintCost.toString()),
        releaseTime: Math.round(releaseDate.getTime() / 1000), // TODO: Test this
        baseURI: `ipfs://${dir}/`,
        package: 0, // Default package
      } as ProjectParamsStruct;

      setParams(_params);

      await submitProject(_params);
    } catch (err) {
      // TODO: Report to sentry
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
        disabled={loading || !isConnected || !isRinkeby || !sufficientEth} // TODO: Update this to check for mainnet
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
