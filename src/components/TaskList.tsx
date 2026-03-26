import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { TaskItem as TaskModel } from '../utils/handle-api';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: TaskModel[];
  onEditTask: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TaskItem
          text={item.text}
          onEdit={() => onEditTask(item._id, item.text)}
          onDelete={() => onDeleteTask(item._id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    marginTop: 24,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#555',
    fontSize: 15,
  },
});

export default TaskList;
