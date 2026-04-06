import { useSpeechRecognitionStore } from "@/features/speech-to-text/presentation/store/speech-recognition-store";

export const useSpeechRecognition = () => {
  const speechRecognitionStatus = useSpeechRecognitionStore(
    (state) => state.speechRecognitionStatus,
  );
  const transcriptTokens = useSpeechRecognitionStore(
    (state) => state.transcriptTokens,
  );
  const finalTranscript = useSpeechRecognitionStore(
    (state) => state.finalTranscript,
  );
  const speechRecognitionError = useSpeechRecognitionStore(
    (state) => state.speechRecognitionError,
  );
  const transcribeAudioFile = useSpeechRecognitionStore(
    (state) => state.transcribeAudioFile,
  );
  const clearSpeechRecognitionTranscript = useSpeechRecognitionStore(
    (state) => state.clearSpeechRecognitionTranscript,
  );
  const clearSpeechRecognitionError = useSpeechRecognitionStore(
    (state) => state.clearSpeechRecognitionError,
  );

  return {
    speechRecognitionStatus,
    transcriptTokens,
    finalTranscript,
    speechRecognitionError,
    transcribeAudioFile,
    clearSpeechRecognitionTranscript,
    clearSpeechRecognitionError,
  };
};
