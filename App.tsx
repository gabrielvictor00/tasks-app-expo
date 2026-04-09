import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import TaskList from './src/components/TaskList';
import {
  addTask,
  deleteTask,
  getAllTasks,
  updateTask,
  TaskItem,
} from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [loading, setLoading] = useState(true);

  // novos estados
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks, setLoading);
  }, []);

  const openCreateModal = () => {
    setIsUpdating(false);
    setTaskId('');
    setText('');
    setCompleted(false);
    setDueDate(null);
    setModalVisible(true);
  };

  const updateMode = (_id: string, currentText: string, task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(_id);
    setText(currentText);
    setCompleted(Boolean(task.completed));
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleAddOrUpdateTask = () => {
    if (!text.trim()) return;

    if (isUpdating) {
      updateTask(
        taskId,
        text.trim(),
        dueDate,
        completed,
        setTasks,
        setText,
        setDueDate,
        setCompleted,
        setIsUpdating,
        setLoading
      );
    } else {
      addTask(
        text.trim(),
        dueDate,
        completed,
        setText,
        setDueDate,
        setCompleted,
        setTasks,
        setLoading
      );
    }

    setModalVisible(false);
  };

  const handleDeleteAllTasks = () => {
    // se tiver endpoint de "delete-all", troque para uma chamada de API
    setTasks([]);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setDueDate(date);
    }
  };

  const formattedDueDate = dueDate
    ? dueDate.toLocaleDateString('pt-BR')
    : 'Sem data definida';

  const completedTaskIds = tasks
    .filter((t) => t.completed)
    .map((t) => t._id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('./assets/task-app-banner.png')}
            style={styles.logo}
          />
          <Text style={styles.header}>Tarefas</Text>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Total de Tarefas: {tasks.length}
          </Text>
        </View>

        {/* Barra superior com Pressable */}
        <View style={styles.actionsBar}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={openCreateModal}
          >
            <Text style={styles.primaryButtonText}>Nova tarefa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={handleDeleteAllTasks}
          >
            <Text style={styles.deleteButtonText}>
              Excluir todas as tarefas
            </Text>
          </Pressable>
        </View>

        <TaskList
          tasks={tasks}
          completedTaskIds={completedTaskIds}
          onEditTask={(id, txt) => {
            const task = tasks.find((t) => t._id === id);
            if (task) {
              updateMode(id, txt, task);
            }
          }}
          onDeleteTask={(id) => deleteTask(id, setTasks, setLoading)}
          onToggleCompleteTask={(id) => {
            const task = tasks.find((t) => t._id === id);
            if (!task) return;

            const newCompleted = !task.completed;
            updateTask(
              id,
              task.text,
              task.dueDate ? new Date(task.dueDate) : null,
              newCompleted,
              setTasks,
              setText,
              setDueDate,
              setCompleted,
              setIsUpdating,
              setLoading
            );
          }}
        />

        {/* Modal de criação/edição de tarefa */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {isUpdating ? 'Editar tarefa' : 'Nova tarefa'}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Descrição da tarefa..."
                value={text}
                maxLength={50}
                onChangeText={setText}
              />

              <View style={styles.modalRow}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? '#1f7a45' : undefined}
                />
                <Text style={styles.modalRowText}>Marcar como concluída</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.dateButton,
                  pressed && styles.dateButtonPressed,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {dueDate
                    ? `Vencimento: ${formattedDueDate}`
                    : 'Definir data de vencimento'}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalSecondaryButton,
                    pressed && styles.modalSecondaryButtonPressed,
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                    setIsUpdating(false);
                    setText('');
                    setCompleted(false);
                    setDueDate(null);
                  }}
                >
                  <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalPrimaryButton,
                    pressed && styles.modalPrimaryButtonPressed,
                  ]}
                  onPress={handleAddOrUpdateTask}
                >
                  <Text style={styles.modalPrimaryButtonText}>
                    {isUpdating ? 'Salvar alterações' : 'Adicionar tarefa'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
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
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#666',
  },
  actionsBar: {
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  deleteButtonPressed: {
    backgroundColor: '#d9363e',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  modalRowText: {
    fontSize: 15,
  },
  dateButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dateButtonPressed: {
    backgroundColor: '#f3f3f3',
    transform: [{ scale: 0.98 }],
  },
  dateButtonText: {
    fontSize: 15,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalSecondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalSecondaryButtonPressed: {
    backgroundColor: '#f2f2f2',
    transform: [{ scale: 0.98 }],
  },
  modalSecondaryButtonText: {
    fontSize: 15,
    color: '#333',
  },
  modalPrimaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  modalPrimaryButtonPressed: {
    backgroundColor: '#222',
    transform: [{ scale: 0.98 }],
  },
  modalPrimaryButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
});