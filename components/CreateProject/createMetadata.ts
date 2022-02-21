import { AddResult } from "ipfs-core-types/src/root";

interface MetadataAttribute {
  trait_type: string;
  value: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: MetadataAttribute[];
}

interface CreateMetadataArgs {
  songs: AddResult[];
  description: string;
  imageURI: string;
  audioDirCID: string;
  artistName: string;
  albumName: string;
  releaseDate: string;
}

export const createMetadata = ({
  songs,
  description,
  imageURI,
  audioDirCID,
  artistName,
  albumName,
  releaseDate,
}: CreateMetadataArgs) =>
  songs.map((audio) =>
    JSON.stringify({
      name: audio.path,
      description,
      image: imageURI,
      animation_url: `ipfs://${audioDirCID}/${audio.path}`,
      attributes: [
        {
          trait_type: "Artist",
          value: artistName,
        },
        {
          trait_type: "Album",
          value: albumName,
        },
        {
          trait_type: "Album Release Date",
          value: releaseDate,
        },
      ],
    } as Metadata)
  );

export const assignMetadataFilePaths = (metadata: string[]) =>
  metadata.map((content, index) => ({
    path: `${index + 1}.json`,
    content,
  }));
