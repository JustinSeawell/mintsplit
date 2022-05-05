import { MetaData } from "../types/MetaData";
import { Project } from "../types/Project";
import { Song } from "../types/Song";
import { ipfsPath } from "../util";
import { format } from "./metaData";
import { uploadFilesToIPFS } from "./uploadToIPFS";

export const uploadAudio = async (files: File[]) => {
  const toUpload = files.map((file) => ({ path: file.name, content: file }));
  const results = await uploadFilesToIPFS(toUpload);
  if (results.length === 0)
    throw new Error("Audio files upload attempt failed");
  const dir = results.pop().cid.toString() as string;
  return { results, dir };
};

export const uploadArtwork = async (_files: File[]) => {
  const files = _files.map((file) => ({ path: file.name, content: file }));

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

interface MetaDataFile {
  path: string;
  content: string;
}

export const uploadMetadata = async (
  metaData: MetaData,
  contentId: number,
  qty: number
) => {
  const toBeUploaded = [] as MetaDataFile[];

  const editions = Array.from(Array(qty).keys(), (_, i) => i + 1);
  editions.forEach((edition) => {
    toBeUploaded.push({
      path: `${contentId}-${edition}.json`,
      content: JSON.stringify(format(metaData, edition)),
    } as MetaDataFile);
  });
  const results = await uploadFilesToIPFS(toBeUploaded);
  if (results.length === 0) throw new Error("Metadata upload attempt failed");
  const dir = results.pop().cid.toString();
  return { results, dir };
};

export const uploadSongs = async (songs: Song[], project?: Project) => {
  const audioFiles = songs.map((song) => song.audio);
  const { dir: audioDir } = await uploadAudio(audioFiles);

  const artworkFiles = songs.map((song) => song.art);
  const { dir: artworkDir } = await uploadArtwork(artworkFiles);

  const toBeUploaded = [] as MetaDataFile[];

  songs.forEach((song, index) => {
    const contentId = index + 1;

    const baseMetaData = {
      name: song?.name,
      description: project?.description,
      image: ipfsPath(artworkDir, song?.art.name),
      animation_url: ipfsPath(audioDir, song?.audio.name),
      attributes: [
        {
          trait_type: "Song",
          value: song.name,
        },
        {
          trait_type: "Artist",
          value: project?.artistName,
        },
        {
          trait_type: "Total Editions",
          value: song.editions.toString(),
        },
      ],
    } as MetaData;

    const editions = Array.from(
      Array(song.editions as number).keys(),
      (_, i) => i + 1
    );

    editions.forEach((edition) => {
      toBeUploaded.push({
        path: `${contentId}-${edition}.json`,
        content: JSON.stringify(format(baseMetaData, edition)),
      } as MetaDataFile);
    });
  });

  const results = await uploadFilesToIPFS(toBeUploaded);
  if (results.length === 0) throw new Error("Metadata upload attempt failed");
  const dir = results.pop().cid.toString();
  return { results, dir };
};
