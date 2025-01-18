import { ThemedButton } from '@/components/ThemedButton';
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { signOut } from '@/redux/auth';
import { useAppDispatch } from '@/redux/store';
import { StyleSheet } from 'react-native';

export default function Profile() {
  const dispatch = useAppDispatch();

  const onSignOut = () => {
    dispatch(signOut());
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText>Profile</ThemedText>
      <ThemedButton onPress={onSignOut} variant='error'>
        Sign Out
      </ThemedButton>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
});
