import { Song } from "../../types/Song";

export const getTokenRanges = (songs: Song[]) => {
  let prevEnd: number; // End of previous range

  const ranges = songs.map(({ editions }, index) => {
    const start = index < 1 ? 1 : prevEnd + 1;
    const end = index < 1 ? editions : start + (editions - 1);

    prevEnd = end;

    return [start, end];
  });

  return ranges;
};
