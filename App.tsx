import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, clearAllTasks, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  useEffect(() => {
    setCompletedTaskIds((previousCompletedTaskIds) =>
      previousCompletedTaskIds.filter((id) => tasks.some((task) => task._id === id))
    );
  }, [tasks]);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  const toggleTaskCompletion = (taskItemId: string) => {
    setCompletedTaskIds((previousCompletedTaskIds) => {
      if (previousCompletedTaskIds.includes(taskItemId)) {
        return previousCompletedTaskIds.filter((id) => id !== taskItemId);
      }

      return [...previousCompletedTaskIds, taskItemId];
    });
  };

  const handleDeleteTask = (taskItemId: string) => {
    setCompletedTaskIds((previousCompletedTaskIds) =>
      previousCompletedTaskIds.filter((id) => id !== taskItemId)
    );
    deleteTask(taskItemId, setTasks);
  };

  const handleClearAllTasks = () => {
    setCompletedTaskIds([]);
    clearAllTasks(tasks, setTasks);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('./assets/task-app-banner.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.header}>Tarefas</Text>
        <View style={styles.counterWrap}>
          <Text style={styles.counterText}>Total de tarefas: {tasks.length}</Text>
          <Text style={styles.counterText}>Concluídas: {completedTaskIds.length}</Text>
        </View>

        <View style={styles.top}>
          <TextInput
            style={styles.input}
            placeholder="Descreva sua próxima tarefa..."
            value={text}
            onChangeText={(val) => setText(val)}
            maxLength={80}
            autoCapitalize="sentences"
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={
              isUpdating
                ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
                : () => addTask(text, setText, setTasks)
            }
          >
            <Text style={styles.addButtonText}>
              {isUpdating ? "Atualizar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputHint}>{text.length}/80 caracteres</Text>

        <View style={styles.clearButtonWrap}>
          <Button
            title="Excluir todas as tarefas"
            color="#b3261e"
            onPress={handleClearAllTasks}
          />
        </View>

        <View style={styles.list}>
          <TaskList
            tasks={tasks}
            completedTaskIds={completedTaskIds}
            onEditTask={updateMode}
            onDeleteTask={handleDeleteTask}
            onToggleCompleteTask={toggleTaskCompletion}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerImage: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    height: 88,
  },
  header: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterWrap: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 15,
    color: '#2f2f2f',
  },
  top: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#a8a8a8',
    borderRadius: 8,
    backgroundColor: '#f6f6f6',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputHint: {
    marginTop: 6,
    color: '#6b6b6b',
    fontSize: 12,
  },
  clearButtonWrap: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
});
