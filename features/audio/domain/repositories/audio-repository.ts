export type AudioRepository = {
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  getMeteringDbfs: () => number;
  startPlayback: (uri: string) => void;
  stopPlayback: () => void;
};
