import { Project } from "../types/Project";

export interface ProjectInputError {
  name?: string;
  symbol?: string;
  description?: string;
  artistName?: string;
  mintPrice?: string;
  releaseDate?: string;
}

export const validate = (project: Project, field?: keyof ProjectInputError) => {
  const newError: ProjectInputError = {};

  if (!field || field == "name") {
    if (!project?.name?.trim()) newError.name = "Project name cannot be empty";
  }

  if (!field || field == "symbol") {
    if (!project?.symbol?.trim())
      newError.symbol = "Project symbol cannot be empty";
  }

  if (!field || field == "description") {
    if (!project?.description?.trim())
      newError.description = "Project description cannot be empty";
  }

  if (!field || field == "artistName") {
    if (!project?.artistName?.trim())
      newError.artistName = "Artist name cannot be empty";
  }

  return newError;
};
