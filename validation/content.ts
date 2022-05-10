import { FILE_LIMIT, FILE_LIMIT_DISPLAY } from "../constants";
import { Content } from "../types/Content";

export interface ContentInputError {
  name?: string;
  editions?: string;
  artwork?: string;
}

export const validate = (content: Content, field?: keyof ContentInputError) => {
  const newError: ContentInputError = {};

  if (!field || field == "name") {
    if (!content?.name?.trim()) newError.name = "Name cannot be empty";
  }

  if (!field || field == "editions") {
    if (!content?.editions)
      newError.editions = "Editions must be greater than zero";
  }

  if (!field || field == "artwork") {
    if (!content?.artURI && !content?.artFile)
      newError.artwork = "Please submit artwork";
    if (content?.artFile && content?.artFile?.size > FILE_LIMIT)
      newError.artwork = `Artwork file size must be less than ${FILE_LIMIT_DISPLAY}`;
  }

  return newError;
};
