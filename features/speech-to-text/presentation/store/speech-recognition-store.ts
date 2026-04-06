import { create } from "zustand";

import { AppError } from "@/core/domain/errors/app-error";
import { SpeechRecognitionStatus } from "@/features/speech-to-text/domain/entities/speech-recognition-status";

import type { TranscriptToken } from "@/features/speech-to-text/domain/entities/transcript-result";
import type { SpeechRecognitionRepository } from "@/features/speech-to-text/domain/repositories/speech-recognition-repository";
import type { StoreApi, UseBoundStore } from "zustand";

const POLLING_INTERVAL_MS = 1000;

type SpeechRecognitionState = {
  speechRecognitionStatus: SpeechRecognitionStatus;
  transcriptTokens: TranscriptToken[];
  finalTranscript: string;
  speechRecognitionError: AppError | null;
};

type SpeechRecognitionActions = {
  transcribeAudioFile: (fileUri: string) => Promise<void>;
  clearSpeechRecognitionTranscript: () => void;
  clearSpeechRecognitionError: () => void;
};

type SpeechRecognitionStore = SpeechRecognitionState &
  SpeechRecognitionActions;

const initialState: SpeechRecognitionState = {
  speechRecognitionStatus: SpeechRecognitionStatus.Idle,
  transcriptTokens: [],
  finalTranscript: "",
  speechRecognitionError: null,
};

const pollUntilCompleted = async (
  repository: SpeechRecognitionRepository,
  transcriptionId: string,
): Promise<void> => {
  const job =
    await repository.getTranscriptionJobStatus(transcriptionId);

  if (job.status === "completed") return;
  if (job.status === "error") {
    throw new Error("speechToText.errors.transcriptionFailed");
  }

  await new Promise((resolve) =>
    setTimeout(resolve, POLLING_INTERVAL_MS),
  );
  return pollUntilCompleted(repository, transcriptionId);
};

const createSpeechRecognitionStore = (
  repository: SpeechRecognitionRepository,
): UseBoundStore<StoreApi<SpeechRecognitionStore>> =>
  create<SpeechRecognitionStore>()((set) => ({
    ...initialState,

    transcribeAudioFile: async (fileUri: string) => {
      let fileId: string | null = null;
      let transcriptionId: string | null = null;

      try {
        set({
          speechRecognitionStatus: SpeechRecognitionStatus.Transcribing,
          speechRecognitionError: null,
          transcriptTokens: [],
          finalTranscript: "",
        });

        fileId = await repository.uploadAudioFile(fileUri);
        transcriptionId =
          await repository.createTranscriptionJob(fileId);

        await pollUntilCompleted(repository, transcriptionId);

        const result =
          await repository.getTranscript(transcriptionId);

        set({
          speechRecognitionStatus:
            SpeechRecognitionStatus.Completed,
          transcriptTokens: result.tokens,
          finalTranscript: result.text,
        });
      } catch (error: unknown) {
        console.error("[SpeechRecognition] Transcription error:", error);
        set({
          speechRecognitionStatus: SpeechRecognitionStatus.Error,
          speechRecognitionError: AppError.fromUnknown(error),
        });
      } finally {
        if (transcriptionId) {
          repository
            .deleteTranscriptionJob(transcriptionId)
            .catch(() => {});
        }
        if (fileId) {
          repository.deleteAudioFile(fileId).catch(() => {});
        }
      }
    },

    clearSpeechRecognitionTranscript: () => {
      set({
        transcriptTokens: [],
        finalTranscript: "",
        speechRecognitionStatus: SpeechRecognitionStatus.Idle,
      });
    },

    clearSpeechRecognitionError: () => {
      set({ speechRecognitionError: null });
    },
  }));

let speechRecognitionStoreInstance: UseBoundStore<
  StoreApi<SpeechRecognitionStore>
> | null = null;

export const initializeSpeechRecognitionStore = (
  repository: SpeechRecognitionRepository,
): void => {
  speechRecognitionStoreInstance =
    createSpeechRecognitionStore(repository);
};

export const useSpeechRecognitionStore = <T>(
  selector: (state: SpeechRecognitionStore) => T,
): T => {
  if (!speechRecognitionStoreInstance) {
    throw new Error(
      "Speech recognition store not initialized. Call initializeSpeechRecognitionStore first.",
    );
  }
  return speechRecognitionStoreInstance(selector);
};
