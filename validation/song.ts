import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../constants";
import { Song } from "../types/Song";

export interface SongInputError {
  name?: string;
  editions?: string;
  artwork?: string;
}

export const validate = (song: Song, field?: keyof SongInputError) => {
  const newError: SongInputError = {};

  if (!field || field == "name") {
    if (!song?.name?.trim()) newError.name = "Song name cannot be empty";
  }

  if (!field || field == "editions") {
    if (!song?.editions)
      newError.editions = "Editions must be greater than zero";
  }

  if (!field || field == "artwork") {
    if (!song?.art) newError.artwork = "Please submit artwork";
    if (song?.art?.size > FILE_LIMIT)
      newError.artwork = `Artwork file size must be less than ${FILE_LIMIT_DISPLAY}`;
  }

  return newError;
};
