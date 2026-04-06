export type TranscriptionJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "error";

export type TranscriptionJob = {
  id: string;
  status: TranscriptionJobStatus;
};
