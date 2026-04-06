export type TranscriptToken = {
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
};

export type TranscriptResult = {
  text: string;
  tokens: TranscriptToken[];
};
