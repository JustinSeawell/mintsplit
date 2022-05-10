import { Song } from "../../types/Song";

export const convertAudioToSongs = (audio: FileList) =>
  Array.from(audio).map(
    (file) => ({ audio: file, tmpAudioUrl: URL.createObjectURL(file) } as Song)
  );
