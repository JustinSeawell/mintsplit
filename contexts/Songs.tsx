import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Song } from "../types/Song";

interface SongsContextValue {
  songs: Song[];
  setSongs: Dispatch<SetStateAction<Song[]>>;
  setSong: (newSong: Song, index: number) => void;
}

const SongsContext = createContext<SongsContextValue>(null);

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);

  const setSong = (newSong: Song, index: number) => {
    const newSongs = [...songs];
    newSongs[index] = newSong;
    setSongs(newSongs);
  };

  return (
    <SongsContext.Provider value={{ songs, setSongs, setSong }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => useContext(SongsContext);
