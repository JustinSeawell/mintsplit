import { formatEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useState } from "react";
import useAudioNFTContract from "../../hooks/useAudioNFTContract";
import useCollectionData from "../../hooks/useCollectionData";

/**
 * TODO:
 * - cover error scenario (ex: minting fails)
 * - Check to make sure contract exists in nft factory project
 *
 */

function Collection() {
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const audioNFT = useAudioNFTContract(contractAddress);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { account } = useWeb3React();
  const { data } = useCollectionData(contractAddress);
  const { name, cost, totalSupply, maxSupply, allowMintingAfter, isRevealed } =
    {
      ...data,
    };

  const handleClick = async () => {
    setLoading(true);

    try {
      const trx = await audioNFT.mint(1, {
        from: account,
        value: cost,
      });

      await trx.wait();
      setSuccess(true);
    } catch (error) {
      console.error("Failed To Mint", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>MintSplit{name && ` | ${name}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!data && <CircularProgress />}
      {data && (
        <section>
          <Typography variant="h4">{name}</Typography>
          <br />
          <Typography>{cid}</Typography>
          <br />
          <Typography>
            {totalSupply.toString()} / {maxSupply.toString()} mints remaining
          </Typography>
          <br />
          <Typography>Cost: Ξ{formatEther(cost.toString())}</Typography>
          <br />
          <Typography>
            Seconds Until Reveal: {allowMintingAfter.toString()}
          </Typography>
          <br />
          <LoadingButton
            variant="contained"
            loading={loading}
            size="large"
            component="span"
            onClick={handleClick}
          >
            Mint!
          </LoadingButton>
          <br />
          <br />
          {success && (
            <Typography color={"green"}>
              You successfully minted an NFT!
            </Typography>
          )}
        </section>
      )}
    </div>
  );
}

export default Collection;
