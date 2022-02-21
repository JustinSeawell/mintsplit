import { create } from "ipfs-http-client";
import { AddResult } from "ipfs-core-types/src/root";

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // TODO: Pull from env vars

export const uploadFilesToIPFS = async (
  fileDetails: { path: string; content: File | Blob | string }[]
) => {
  let results: AddResult[] = [];
  try {
    for await (const result of ipfs.addAll(fileDetails, {
      wrapWithDirectory: true,
    })) {
      results.push(result);
    }
  } catch (err) {
    console.error(err);
  }

  return results;
};

export const getIPFSDirectory = (results: AddResult[]) =>
  results.pop().cid.toString();
