import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import type { TaskItem as TaskModel } from '../utils/handle-api';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: TaskModel[];
  completedTaskIds: string[];
  onEditTask: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompleteTask: (taskId: string) => void;
}

interface TaskSection {
  title: string;
  data: TaskModel[];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  completedTaskIds,
  onEditTask,
  onDeleteTask,
  onToggleCompleteTask,
}) => {
  const completedIdsSet = new Set(completedTaskIds);

  const sections: TaskSection[] = [
    {
      title: 'A Fazer',
      data: tasks.filter((task) => !completedIdsSet.has(task._id)),
    },
    {
      title: 'Concluídas',
      data: tasks.filter((task) => completedIdsSet.has(task._id)),
    },
  ];

  const hasTasks = sections.some((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContent}
      renderSectionHeader={({ section }) => {
        if (!section.data.length) {
          return null;
        }

        return (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        );
      }}
      renderItem={({ item }) => (
        <TaskItem
          text={item.text}
          dueDate={item.dueDate}
          isCompleted={completedIdsSet.has(item._id)}
          onEdit={() => onEditTask(item._id, item.text)}
          onDelete={() => onDeleteTask(item._id)}
          onToggleComplete={() => onToggleCompleteTask(item._id)}
        />
      )}
      ListEmptyComponent={
        !hasTasks ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  sectionHeaderContainer: {
    marginTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b4b4b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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