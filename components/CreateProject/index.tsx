import { Stack } from "@mui/material";
import { useState } from "react";
import { Project } from "../../types/Project";
import { Song } from "../../types/Song";
import ManageSongs from "../ManageSongs";
import SetupProject from "../SetupProject";
import UploadAudio from "../UploadAudio";

enum CreateProjectStep {
  One,
  Two,
  Three,
  Four,
  Five,
}

function CreateProject() {
  const [step, setStep] = useState(CreateProjectStep.One);
  const [songs, setSongs] = useState<Song[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const setSong = (newSong: Song, index: number) => {
    const newSongs = [...songs];
    newSongs[index] = newSong;
    setSongs(newSongs);
  };

  return (
    <Stack spacing={3} alignItems="center">
      {step === CreateProjectStep.One && (
        <UploadAudio
          setSongs={setSongs}
          onComplete={() => setStep(CreateProjectStep.Two)}
        />
      )}
      {step === CreateProjectStep.Two && (
        <ManageSongs
          songs={songs}
          setSong={setSong}
          onComplete={() => setStep(CreateProjectStep.Three)}
        />
      )}
      {step === CreateProjectStep.Three && (
        <SetupProject project={project} setProject={setProject} />
      )}
      {/* Step 4: Royalties */}
      {/* Step 5: Review & Launch */}
    </Stack>
  );
}

export default CreateProject;
