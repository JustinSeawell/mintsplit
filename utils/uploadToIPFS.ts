import { create } from "ipfs-http-client";

export const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // TODO: Pull from env vars
// TODO: Use infura api

export const uploadFilesToIPFS = async (
  fileDetails: { path: string; content: File | Blob | string }[]
) => {
  let results = [];
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

export const getIPFSDirectory = (results) => results.pop().cid.toString();
