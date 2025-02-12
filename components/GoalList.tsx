import { FlatList, ListRenderItem } from 'react-native';
import { GoalItem, Goal } from './GoalItem';

export const GoalList = ({ goals }: { goals: Goal[] }) => {
  const renderItem: ListRenderItem<Goal> = ({ item }) => (
    <GoalItem goal={item} />
  );

  return (
    <FlatList
      data={goals}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
    />
  );
};
