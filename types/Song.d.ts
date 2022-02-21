export type Song = {
  name?: string;
  editions?: number;
  art?: File;
  audio: File;
  tmpAudioUrl: string; // Used for displaying song preview
};
