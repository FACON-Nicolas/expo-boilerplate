import { StyleSheet, View } from 'react-native';
import { getYearProgress } from '../utils/time';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useTranslation } from 'react-i18next';

export type Goal = {
  name: string;
  expectedValue: number;
  currentValue: number;
};

const ProgressBar = ({
  progress,
  color = '#22C55E',
  label,
}: {
  progress: number;
  color?: string;
  label?: string;
}) => {
  return (
    <View style={styles.progressWrapper}>
      {label && <ThemedText>{label}</ThemedText>}
      <ThemedView style={styles.progressContainer}>
        <ThemedView
          style={[
            styles.progressBar,
            { width: `${progress}%`, backgroundColor: color },
          ]}
        />
      </ThemedView>
    </View>
  );
};

export const GoalItem = ({ goal }: { goal: Goal }) => {
  const yearProgress = getYearProgress();
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type='subtitle'>{goal.name}</ThemedText>
        <View style={styles.values}>
          <ThemedText>{goal.currentValue}</ThemedText>
          <ThemedText>/</ThemedText>
          <ThemedText>{goal.expectedValue}</ThemedText>
        </View>
      </View>
      <ProgressBar
        progress={(goal.currentValue / goal.expectedValue) * 100}
        color={'blue'}
        label={t('goals.goal')}
      />
      <ProgressBar progress={yearProgress} label={t('goals.year')} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'beige',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    flexGrow: 1,
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#22C55E',
    borderRadius: 5,
  },
});
