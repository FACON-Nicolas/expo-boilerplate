import { StyleSheet, View } from "react-native";

import { WaveformBar } from "@/ui/components/waveform/waveform-bar";
import { useThemeColors } from "@/ui/theme/use-theme-colors";

type WaveformSample = {
  value: number;
  capturedAtMs: number;
};

type WaveformProps = {
  amplitudeSamples: WaveformSample[];
};

export function Waveform({ amplitudeSamples }: WaveformProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {amplitudeSamples.map((sample, index) => (
        <WaveformBar
          key={index}
          normalizedHeight={sample.value}
          color={colors.primary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    height: 80,
    overflow: "hidden",
  },
});
