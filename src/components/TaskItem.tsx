import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
	text: string;
	isCompleted: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onToggleComplete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ text, isCompleted, onEdit, onDelete, onToggleComplete }) => {
	return (
		<View style={[styles.itemContainer, isCompleted && styles.itemContainerCompleted]}>
			<Text style={[styles.itemText, isCompleted && styles.itemTextCompleted]}>{text}</Text>

			<View style={styles.actions}>
				<TouchableOpacity onPress={onToggleComplete} accessibilityLabel="Marcar tarefa como concluida">
					<Feather
						name={isCompleted ? 'rotate-ccw' : 'check-circle'}
						size={20}
						color="#fff"
						style={styles.icon}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={onEdit} accessibilityLabel="Editar tarefa">
					<Feather name="edit" size={20} color="#fff" style={styles.icon} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onDelete} accessibilityLabel="Excluir tarefa">
					<AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		backgroundColor: '#000',
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	itemContainerCompleted: {
		backgroundColor: '#1f7a45',
	},
	itemText: {
		color: '#fff',
		fontSize: 16,
		flex: 1,
	},
	itemTextCompleted: {
		textDecorationLine: 'line-through',
		opacity: 0.9,
	},
	actions: {
		flexDirection: 'row',
		marginLeft: 16,
		gap: 16,
	},
	icon: {
		padding: 2,
	},
});

export default TaskItem;
