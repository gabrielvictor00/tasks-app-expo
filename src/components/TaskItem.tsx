import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
	text: string;
	onEdit: () => void;
	onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ text, onEdit, onDelete }) => {
	return (
		<View style={styles.itemContainer}>
			<Text style={styles.itemText}>{text}</Text>

			<View style={styles.actions}>
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
	itemText: {
		color: '#fff',
		fontSize: 16,
		flex: 1,
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
