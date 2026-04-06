import { useRef } from "react";

import { secureStorage } from "@/core/data/storage/secure-storage";
import { createSonioxSpeechRecognitionRepository } from "@/features/speech-to-text/data/repositories/soniox-speech-recognition-repository";
import { initializeSpeechRecognitionRepository } from "@/features/speech-to-text/presentation/store/speech-recognition-repository";
import { initializeSpeechRecognitionStore } from "@/features/speech-to-text/presentation/store/speech-recognition-store";

const SONIOX_API_KEY_STORAGE_KEY = "soniox-api-key";

export const getSonioxApiKeyStorageKey = (): string =>
  SONIOX_API_KEY_STORAGE_KEY;

export const useSpeechRecognitionInit = (): void => {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    isInitialized.current = true;
    const repository = createSonioxSpeechRecognitionRepository(
      () => secureStorage.getItem(SONIOX_API_KEY_STORAGE_KEY),
    );
    initializeSpeechRecognitionRepository(repository);
    initializeSpeechRecognitionStore(repository);
  }
};
