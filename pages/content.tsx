import { formatEther } from "@ethersproject/units";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, useEffect, useState } from "react";
import ContentInput from "../components/ContentInput";
import Layout from "../components/Layout";
import OrderSummary from "../components/OrderSummary";
import { ContentStruct } from "../contracts/types/MintSplitERC721";
import useCollectionData from "../hooks/useCollectionData";
import useMetaData from "../hooks/useMetaData";
import useTokenFee from "../hooks/useTokenFee";
import { Content } from "../types/Content";
import { ipfsPath } from "../util";
import { uploadArtwork, uploadAudio, uploadMetadata } from "../utils/upload";
import { ContentInputError, validate } from "../validation/content";
import useMintSplitFactory from "../hooks/useMintSplitFactory";
import { useWeb3React } from "@web3-react/core";
import { Label } from "../components/Label";
import { Input } from "../components/Input";
import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../constants";
import BackButton from "../components/BackButton";
import { MetaData } from "../types/MetaData";
import mixpanel from "mixpanel-browser";

function Content() {
  const router = useRouter();
  const { cid, c } = router.query;
  const contractAddress = cid as string;
  const contentId = parseInt(c as string);
  const isAdding = isNaN(contentId);
  const title = isAdding ? "Add Content" : "Edit Content";
  const { data: collectionData } = useCollectionData(contractAddress);
  const { data: metaData } = useMetaData(
    contractAddress,
    // If adding, fetch metadata for content #1 to obtain project info
    isAdding ? 1 : contentId
  );
  const editions = collectionData?.editions;
  const contentEditions = collectionData?.editions?.[contentId - 1];
  const [content, setContent] = useState<Content>(null);
  const newTokens = (content?.editions -
    (contentEditions ? contentEditions?.toNumber() : 0)) as number;
  const { data: tokenFee } = useTokenFee(newTokens);
  const [inputError, setInputError] = useState<ContentInputError>({});
  const [loading, setLoading] = useState(false);
  const mintSplitFactory = useMintSplitFactory();
  const { account } = useWeb3React();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Request user confirmation before leaving the page
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  useEffect(() => {
    if (isAdding || content || !metaData || !collectionData) return;

    let newContent: Content;
    if (contentEditions?.isZero()) {
      newContent = {
        id: contentId,
      };
    } else {
      newContent = {
        id: contentId,
        name: metaData?.name,
        artURI: metaData?.image,
        audioURI: metaData?.animation_url,
        editions: contentEditions?.toNumber(),
      };
    }

    setContent(newContent);
  }, [
    collectionData,
    content,
    contentEditions,
    contentId,
    editions?.length,
    isAdding,
    metaData,
  ]);

  const handleAudioFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    let isAllowed = true;

    Array.from(e.target.files).forEach((file) => {
      if (file.size > FILE_LIMIT) {
        isAllowed = false;
        setErrorMsg(`Each file should be less than ${FILE_LIMIT_DISPLAY}`);
      }
    });

    if (!isAllowed) return;
    setErrorMsg("");

    const newContent = {
      ...content,
      id: editions?.length + 1,
      audioFile: e.target.files[0],
    } as Content;

    setContent(newContent);
    mixpanel.track("uploaded content");
  };

  const handleDelete = async () => {
    // TODO: Add confirmation
    if (isAdding) {
      setContent(null);
      return;
    }

    setLoading(true);

    try {
      const newContent = {
        id: contentId,
        editions: 0,
        uri: "",
      } as ContentStruct;

      await submitContent(newContent);
      router.push(`/project?cid=${contractAddress}&t=2`);
    } catch (err) {
      // TODO: Report to sentry
      console.error(err);
      setLoading(false);
      setErrorMsg("There was an error deleting this content.");
    }
  };

  const handleSubmit = async () => {
    const newError = validate(content);
    if (Object.keys(newError).length > 0) {
      setInputError(newError);
      return;
    }

    setLoading(true);

    const newMetaData = {
      ...metaData,
      name: content?.name,
      attributes: [
        {
          trait_type: "Song",
          value: content?.name,
        },
        {
          trait_type: "Artist",
          value: metaData?.attributes[1].value, // Artist name
        },
        {
          trait_type: "Total Editions",
          value: content?.editions?.toString(),
        },
      ],
    } as MetaData;

    if (isAdding) {
      delete newMetaData.animation_url;
      delete newMetaData.image;
    }

    // TODO: Implement changing audio file
    if (content?.audioFile) {
      const { dir: audioDir } = await uploadAudio([content?.audioFile]);
      newMetaData.animation_url = ipfsPath(audioDir, content?.audioFile?.name);
    }

    try {
      if (content?.artFile) {
        const { dir: artworkDir } = await uploadArtwork([content?.artFile]);
        newMetaData.image = ipfsPath(artworkDir, content?.artFile?.name);
      }

      const { dir } = await uploadMetadata(
        newMetaData,
        content?.id,
        content?.editions
      );

      const newContent = {
        id: content?.id,
        editions: content?.editions,
        uri: ipfsPath(dir),
      } as ContentStruct;

      await submitContent(newContent);
      router.push(`/project?cid=${contractAddress}&t=2`);
    } catch (err) {
      // TODO: Report to sentry
      console.error(err);
      setLoading(false);
      setErrorMsg("There was an error updating content.");
    }
  };

  const submitContent = async (_content: ContentStruct) => {
    const opts = { from: account, value: null };
    if (newTokens > 0) opts.value = tokenFee;

    if (isAdding) {
      const trx = await mintSplitFactory.addContent(
        contractAddress,
        _content,
        opts
      );
      await trx.wait();
      mixpanel.track("added content", { tokens: newTokens });
    } else {
      const trx = await mintSplitFactory.setContent(
        contractAddress,
        _content,
        opts
      );
      await trx.wait();
    }
  };

  return (
    <Layout title={title}>
      <Grid marginTop={"2rem"}>
        <Grid
          container
          item
          xs={10}
          marginX={"auto"}
          justifyContent={"start"}
          mb={"1rem"}
        >
          <BackButton />
        </Grid>
        {errorMsg && (
          <Grid item xs={6} marginX={"auto"} mb={"2rem"}>
            <Alert severity="error">{errorMsg}</Alert>
          </Grid>
        )}
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Configure your NFT content for the blockchain.
        </Typography>
        {isAdding && !content && (
          <Label htmlFor="audio-files" sx={{ marginY: "1rem" }}>
            <Input
              id="audio-files"
              accept="audio/*"
              type="file"
              onChange={handleAudioFileUpload}
            />
            <LoadingButton
              variant="contained"
              color="secondary"
              size="large"
              component="span"
              fullWidth
              sx={{ padding: "1rem 1.5rem" }}
            >
              Upload Audio
            </LoadingButton>
          </Label>
        )}
        {(!isAdding || content) && (
          <Grid item mt={"3rem"} xs={10} marginX={"auto"}>
            <ContentInput
              title={isAdding ? content?.audioFile?.name : metaData?.name}
              content={content}
              setContent={setContent}
              handleDelete={handleDelete}
              error={inputError}
              setError={setInputError}
            />
            {tokenFee && !tokenFee?.isZero() && (
              <OrderSummary
                fee={formatEther(tokenFee)}
                caption={`This is the cost to ${
                  isAdding ? "add" : "update"
                } your NFT content ${isAdding ? "to" : "on"} the blockchain.`}
              />
            )}
            <LoadingButton
              variant="contained"
              loading={loading}
              disabled={Object.keys(inputError).length > 0 || loading}
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
              <Typography variant="h6">
                {isAdding ? "Add Content" : "Update Content"}
              </Typography>
            </LoadingButton>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}

export default Content;
