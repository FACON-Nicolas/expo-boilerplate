export enum RecordingStatus {
  Idle = 'Idle',
  Recording = 'Recording',
  Stopped = 'Stopped',
}

export type Recording = {
  id: string;
  uri: string | null;
  status: RecordingStatus;
  durationMs: number;
};
