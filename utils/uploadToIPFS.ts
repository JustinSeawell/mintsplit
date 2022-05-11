import { create } from "ipfs-http-client";

const auth =
  "Basic " +
  Buffer.from(
    process.env.NEXT_PUBLIC_INFURA_PID + ":" + process.env.NEXT_PUBLIC_INFURA_PS
  ).toString("base64");

export const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const uploadFilesToIPFS = async (
  fileDetails: { path: string; content: File | Blob | string }[]
) => {
  let results = [];
  try {
    for await (const result of ipfs.addAll(fileDetails, {
      pin: true,
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
