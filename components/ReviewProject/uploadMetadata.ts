import { Project } from "../../types/Project";
import { Song } from "../../types/Song";
import { uploadFilesToIPFS } from "./uploadToIPFS";
import { padSingleDigits } from "./padSingleDigits";

const uploadAudio = async (songs: Song[]) => {
  const files = songs
    .map(({ audio }) => audio)
    .map((file) => ({ path: file.name, content: file }));
  const results = await uploadFilesToIPFS(files);
  if (results.length === 0)
    throw new Error("Audio files upload attempt failed");
  const dir = results.pop().cid.toString() as string;
  return { results, dir };
};

const uploadArtwork = async (songs: Song[]) => {
  const files = songs
    .map(({ art }) => art)
    .map((file) => ({ path: file.name, content: file }));

  const fileNames = files.map((file) => file.path);
  const uniqueFileNames = fileNames.filter((name, index) => {
    return fileNames.indexOf(name) === index;
  });
  const uniqueFiles = uniqueFileNames.map((name) =>
    files.find(({ path }) => path === name)
  );

  const results = await uploadFilesToIPFS(uniqueFiles);
  if (results.length === 0) throw new Error("Art files upload attempt failed");

  const dir = results.pop().cid.toString() as string;
  return { results, dir };
};

export const uploadMetadata = async (
  songs: Song[],
  { description, artistName }: Project,
  setMessage?: (msg: string) => void
) => {
  setMessage("Uploading audio...");
  const { results: audioFiles, dir: audioDir } = await uploadAudio(songs);
  setMessage("Uploading images...");
  const { dir: imageDir } = await uploadArtwork(songs);

  const metaData = [];
  audioFiles.forEach((audio, i) => {
    const song = songs[i];

    const songData = {
      description,
      image: `ipfs://${imageDir}/${song.art.name}`,
      animation_url: `ipfs://${audioDir}/${audio.path}`,
      attributes: [
        {
          trait_type: "Song",
          value: song.name,
        },
        {
          trait_type: "Artist",
          value: artistName,
        },
        {
          trait_type: "Total Editions",
          value: song.editions.toString(),
        },
      ],
    };

    const editions = Array.from(
      Array(song.editions as number).keys(),
      (_, i) => i + 1
    );

    editions.forEach((edition) => {
      metaData.push({
        path: `${i + 1}-${edition}.json`, // {contentId}-{edition}.json
        content: JSON.stringify({
          name: `${song.name} • ${padSingleDigits(edition)}`,
          ...songData,
          attributes: [
            ...songData.attributes,
            {
              trait_type: "Edition",
              value: padSingleDigits(edition),
            },
          ],
        }),
      });
    });
  });

  setMessage("Uploading metadata...");
  const results = await uploadFilesToIPFS(metaData);
  if (results.length === 0) throw new Error("Metadata upload attempt failed");
  const dir = results.pop().cid.toString();
  return { results, dir };
};
