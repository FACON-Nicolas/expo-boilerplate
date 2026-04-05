import { StyleSheet, View } from "react-native";

import { useAmplitudeSampler } from "@/features/audio/presentation/hooks/use-amplitude-sampler";
import { useAudioRecorder } from "@/features/audio/presentation/hooks/use-audio-recorder";
import { Button } from "@/ui/components/button";
import { SafeAreaView } from "@/ui/components/safe-area-view";
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
  } = useAudioRecorder();
  useAmplitudeSampler();

  const buttonState = resolveButtonState(isRecording, recordedUri);

  const onPressButton = () => {
    if (buttonState === "record") return startRecording();
    if (buttonState === "stop") return stopRecording();
    if (isPlaying) return stopPlayback();
    return startPlayback();
  };

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
});
