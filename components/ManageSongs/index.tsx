import { Button, Grid } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useSongs } from "../../contexts/Songs";
import SongInput from "./SongInput";

interface ManageSongsProps {}

function ManageSongs({}: ManageSongsProps) {
  const { songs, setSong } = useSongs();

  return (
    <>
      {songs.map((song, index) => (
        <SongInput key={index} index={index} song={song} setSong={setSong} />
      ))}
    </>
  );
}

export default ManageSongs;
