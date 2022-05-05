import { MetaData } from "../types/MetaData";
import { padSingleDigits } from "../util";

export const formatName = (metaData: MetaData, edition: number) =>
  ({
    ...metaData,
    name: `${metaData?.name} • ${padSingleDigits(edition)}`,
  } as MetaData);

export const addEditionAttribute = (metaData: MetaData, edition: number) =>
  ({
    ...metaData,
    attributes: [
      ...(metaData?.attributes ?? []),
      {
        trait_type: "Edition",
        value: padSingleDigits(edition),
      },
    ],
  } as MetaData);

export const format = (metaData: MetaData, edition: number) =>
  addEditionAttribute(formatName(metaData, edition), edition);
