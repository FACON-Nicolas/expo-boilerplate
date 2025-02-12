import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { GoalList } from '@/components/GoalList';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedIcon } from '@/components/ThemedIcon';

export default function Index() {
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedSafeAreaView>
      <TouchableOpacity>
        <ThemedIcon
          name='add-outline'
          color={textColor}
          style={[styles.addButton, { borderColor: textColor }]}
          size={26}
        />
      </TouchableOpacity>
      <GoalList goals={[]} />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    borderWidth: 2,
    borderRadius: 100,
  },
});
