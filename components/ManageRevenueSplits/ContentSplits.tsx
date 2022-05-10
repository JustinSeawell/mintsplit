import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertColor,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  PaymentSplitConfigStruct,
  PaymentSplitStruct,
} from "../../contracts/types/MintSplitERC721";
import useContent from "../../hooks/useContent";
import useNFTContract from "../../hooks/useNFTContract";
import useSplits from "../../hooks/useSplits";
import theme from "../../theme";
import { clonePaymentSplit } from "../../utils/clonePaymentSplit";
import { convertToBps } from "../../utils/convertToBps";
import { convertToPercentage } from "../../utils/convertToPercentage";
import AddCollaborator from "./AddCollaborator";
import { emptySplit } from "./emptySplit";
import { isEmpty } from "./isEmpty";
import { resultMessage } from "./resultMessage";
import SplitRow from "./SplitRow";

interface ContentSplitsProps {
  id: number;
  contractAddress: string;
  ownerAddress: string;
  isMint?: boolean;
}

const sumBps = (split: PaymentSplitStruct) =>
  split.bps.reduce(
    (sum: number, share: number) => sum + (isNaN(share) ? 0 : share / 100),
    0
  );

function ContentSplits({
  id,
  contractAddress,
  ownerAddress,
  isMint,
}: ContentSplitsProps) {
  const { account } = useWeb3React();
  const contract = useNFTContract(contractAddress);
  const { data: content } = useContent(contractAddress, id);
  const [input, setInput] = useState("");
  const [addressError, setAddressError] = useState("");
  const [bpsError, setBpsError] = useState("");
  const [changed, setChanged] = useState(false);
  const [loadedFromChain, setLoadedFromChain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [split, setSplit] = useState<PaymentSplitStruct>(emptySplit);
  const [defaultPercentage, setDefaultPercentage] = useState(
    isMint ? 100 : undefined
  );
  const [result, setResult] = useState<AlertColor | null>(null);
  const { data: onChain } = useSplits(contractAddress, id, isMint);
  const isOwner = account == ownerAddress;
  const ownerLabel = `${ownerAddress} - (${isOwner ? "You" : "Creator"})`;

  const forceUpdate = async () => {
    const split = await contract.getContentSplits(id, isMint);
    setSplit(split);
    setChanged(false);
  };

  const setBps = (percentage: string, index: number) => {
    const newSplit = clonePaymentSplit(split);
    const percentageNum = parseInt(percentage);
    newSplit.bps[index] = convertToBps(percentageNum);

    setSplit(newSplit);
    const totalShared = sumBps(newSplit);

    let err = "";
    if (totalShared > 100) {
      err = "Splits cannot exceed 100%";
    } else if (!isMint && totalShared > 30) {
      err = "Royalty splits cannot exceed 30%";
    } else if (newSplit.bps.includes(NaN)) {
      err = "Invalid split percentage";
    }

    setBpsError(err);
    markChanged();
  };

  const handleInputChange = (address: string) => {
    setInput(address);

    let error = "";

    if (address && !isAddress(address)) {
      error = "Enter a valid Ethereum address";
    } else if (address == ownerAddress) {
      error = "Owner's address is not allowed";
    } else if (split.recipients.includes(address)) {
      error = "Enter a unique Ethereum address";
    }

    setAddressError(error);
  };

  const markChanged = () => {
    setResult(null);
    if (!changed) setChanged(true);
  };

  const addCollaborator = () => {
    const newSplit = clonePaymentSplit(split);
    newSplit.recipients.push(input);
    setSplit(newSplit);
    setInput("");
    markChanged();
  };

  const updateSplit = async () => {
    setLoading(true);
    const config = {
      contentId: id,
      isMint,
      split,
    } as PaymentSplitConfigStruct;

    try {
      const trx = await contract.setSplit(config, { from: account });
      await trx.wait();
      setResult("success");
      await forceUpdate();
    } catch (err) {
      setResult("error");
    }
    setLoading(false);
  };

  const deleteSplit = async (index: number) => {
    const newSplit = clonePaymentSplit(split);
    newSplit?.recipients?.splice(index, 1);
    newSplit?.bps?.splice(index, 1);

    const isOnChain = !!onChain?.recipients?.[index];
    if (!isOnChain) {
      setSplit(newSplit);
      return;
    }

    setResult(null);
    setLoading(true);
    const config = {
      contentId: id,
      isMint,
      split: newSplit,
    } as PaymentSplitConfigStruct;

    try {
      const trx = await contract.setSplit(config, { from: account });
      await trx.wait();
      setResult("success");
      await forceUpdate();
    } catch (err) {
      setResult("error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isMint) return;

    const totalShared = sumBps(split);
    setDefaultPercentage(100 - (totalShared as number));
  }, [isMint, split]);

  useEffect(() => {
    if (!onChain || loadedFromChain) return;

    setSplit(onChain);
    setLoadedFromChain(true);
  }, [loadedFromChain, onChain]);

  useEffect(() => {
    if (isMint || !isEmpty(split) || !loadedFromChain) return;

    const newSplit = clonePaymentSplit(emptySplit);
    newSplit.recipients.push(ownerAddress);
    // Intentionally not setting Bps here!
    setSplit(newSplit);
  }, [isMint, loadedFromChain, ownerAddress, split]);

  return (
    <>
      <Typography variant="h6" color={theme.palette.primary.light} mr={".5rem"}>
        {content?.name}
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.grey[600]}
        gutterBottom
        mr={".5rem"}
        mb={"1rem"}
      >
        Configure {isMint ? "mint" : "royalty"} splits for {content?.name}
      </Typography>
      <AddCollaborator
        address={input}
        error={addressError}
        handleChange={handleInputChange}
        handleClick={addCollaborator}
      />
      <Divider sx={{ width: "100%", marginY: "1rem" }} />
      <Stack spacing={1}>
        {isMint && (
          <SplitRow
            address={ownerLabel}
            percentage={defaultPercentage}
            disabled
          />
        )}
        {split?.recipients?.map((recipient, i) => (
          <SplitRow
            key={`split-row-${i}`}
            address={recipient == ownerAddress ? ownerLabel : recipient}
            percentage={convertToPercentage(split?.bps?.[i] as number)}
            error={bpsError}
            handleChange={(percentage) => setBps(percentage, i)}
            handleDelete={() => deleteSplit(i)}
          />
        ))}
      </Stack>
      <Divider sx={{ width: "100%", marginY: "1rem" }} />
      <Grid container>
        <Grid mr={".75rem"}>
          <LoadingButton
            variant="contained"
            color="secondary"
            disabled={!changed || !!bpsError}
            onClick={updateSplit}
            loading={loading}
          >
            Update {isMint ? "Mint" : "Royalty"} Splits
          </LoadingButton>
        </Grid>
        {result && (
          <Alert variant="outlined" severity={result}>
            {resultMessage.get(result)}
          </Alert>
        )}
      </Grid>
    </>
  );
}

export default ContentSplits;
