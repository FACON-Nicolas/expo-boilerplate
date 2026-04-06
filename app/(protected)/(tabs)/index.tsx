import { StyleSheet, View } from "react-native";

import { useAmplitudeSampler } from "@/features/audio/presentation/hooks/use-amplitude-sampler";
import { useAudioRecorder } from "@/features/audio/presentation/hooks/use-audio-recorder";
import { SpeechRecognitionStatus } from "@/features/speech-to-text/domain/entities/speech-recognition-status";
import { useSpeechRecognition } from "@/features/speech-to-text/presentation/hooks/use-speech-recognition";
import { Button } from "@/ui/components/button";
import { SafeAreaView } from "@/ui/components/safe-area-view";
import { Text } from "@/ui/components/text";
import { Waveform } from "@/ui/components/waveform/waveform";

type ButtonState = "record" | "stop" | "play";

const resolveButtonState = (
  isRecording: boolean,
  recordedUri: string | null,
): ButtonState => {
  if (isRecording) return "stop";
  if (recordedUri) return "play";
  return "record";
};

const BUTTON_LABEL: Record<ButtonState, string> = {
  record: "Record",
  stop: "Stop",
  play: "Play",
};

const BUTTON_VARIANT: Record<ButtonState, "primary" | "danger" | "secondary"> =
  {
    record: "primary",
    stop: "danger",
    play: "primary",
  };

export default function Index() {
  const {
    amplitudeSamples,
    isRecording,
    isPlaying,
    recordedUri,
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    clearRecording,
  } = useAudioRecorder();
  useAmplitudeSampler();

  const {
    speechRecognitionStatus,
    finalTranscript,
    speechRecognitionError,
    transcribeAudioFile,
    clearSpeechRecognitionTranscript,
  } = useSpeechRecognition();

  const buttonState = resolveButtonState(isRecording, recordedUri);

  const isTranscribing =
    speechRecognitionStatus === SpeechRecognitionStatus.Transcribing;

  const onPressRecordButton = () => {
    clearSpeechRecognitionTranscript();
    startRecording();
  };

  const onPressStopButton = async () => {
    stopRecording();
  };

  const onPressPlayButton = () => {
    if (isPlaying) return stopPlayback();
    return startPlayback();
  };

  const onPressButton = () => {
    if (buttonState === "record") return onPressRecordButton();
    if (buttonState === "stop") return onPressStopButton();
    return onPressPlayButton();
  };

  const onPressResetButton = () => {
    clearRecording();
    clearSpeechRecognitionTranscript();
  };

  const onPressTranscribeButton = () => {
    if (recordedUri) {
      transcribeAudioFile(recordedUri);
    }
  };

  const isResetButtonVisible = buttonState === "play" && !isPlaying;
  const isTranscribeButtonVisible =
    buttonState === "play" && !isPlaying && !isTranscribing;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Waveform amplitudeSamples={amplitudeSamples} />
        <Button
          variant={isPlaying ? "danger" : BUTTON_VARIANT[buttonState]}
          onPress={onPressButton}
        >
          {buttonState === "play" && isPlaying
            ? "Stop"
            : BUTTON_LABEL[buttonState]}
        </Button>
        {isTranscribeButtonVisible && (
          <Button variant='primary' onPress={onPressTranscribeButton}>
            Transcribe
          </Button>
        )}
        {isResetButtonVisible && (
          <Button variant='danger' onPress={onPressResetButton}>
            Reset
          </Button>
        )}
        {isTranscribing && (
          <Text variant='subtitle' style={styles.transcribingIndicator}>
            Transcribing...
          </Text>
        )}
        {speechRecognitionError && (
          <Text variant='error'>{speechRecognitionError.message}</Text>
        )}
        {finalTranscript ? (
          <View style={styles.transcriptContainer}>
            <Text variant='semibold'>Transcript</Text>
            <Text selectable>{finalTranscript}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  transcribingIndicator: {
    textAlign: "center",
  },
  transcriptContainer: {
    gap: 8,
  },
});
