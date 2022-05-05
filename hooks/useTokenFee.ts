import useSWR from "swr";
import { MintSplitFactory } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMintSplitFactory from "./useMintSplitFactory";

function getTokenFee(contract: MintSplitFactory, tokens: number) {
  return async (_: string, address: string) => {
    const fee = await contract.tokenFee(tokens);

    return fee;
  };
}

export default function useTokenFee(tokens: number, suspense = false) {
  const contract = useMintSplitFactory();

  const shouldFetch = !!contract;

  const result = useSWR(
    shouldFetch ? ["TokenFee", tokens] : null,
    getTokenFee(contract, tokens),
    { suspense }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
