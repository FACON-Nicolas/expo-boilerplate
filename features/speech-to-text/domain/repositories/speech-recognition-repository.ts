import type { TranscriptResult } from "@/features/speech-to-text/domain/entities/transcript-result";
import type { TranscriptionJob } from "@/features/speech-to-text/domain/entities/transcription-job";

export type SpeechRecognitionRepository = {
  uploadAudioFile: (fileUri: string) => Promise<string>;
  createTranscriptionJob: (fileId: string) => Promise<string>;
  getTranscriptionJobStatus: (transcriptionId: string) => Promise<TranscriptionJob>;
  getTranscript: (transcriptionId: string) => Promise<TranscriptResult>;
  deleteTranscriptionJob: (transcriptionId: string) => Promise<void>;
  deleteAudioFile: (fileId: string) => Promise<void>;
};
