import type { SpeechRecognitionRepository } from "@/features/speech-to-text/domain/repositories/speech-recognition-repository";

let repository: SpeechRecognitionRepository | null = null;

export const initializeSpeechRecognitionRepository = (
  repo: SpeechRecognitionRepository,
): void => {
  repository = repo;
};

export const getSpeechRecognitionRepository =
  (): SpeechRecognitionRepository => {
    if (!repository) {
      throw new Error(
        "Speech recognition repository not initialized. Call initializeSpeechRecognitionRepository first.",
      );
    }
    return repository;
  };
