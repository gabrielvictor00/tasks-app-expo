import axios from 'axios';
import React from 'react';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export interface TaskItem {
  _id: string;
  text: string;
}

// Função para obter todas as tarefas
export const getAllTasks = (
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  axios
    .get<TaskItem[]>(`${baseURL}`)
    .then(({ data }) => {
      setTasks(data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      console.log('Erro ao obter tarefas:', err);
      if (setLoading) setLoading(false);
    });
};

// Função para adicionar uma nova tarefa
export const addTask = (
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  axios
    .post(`${baseURL}/save`, { text })
    .then(() => {
      setText('');
      getAllTasks(setTasks, setLoading);
    })
    .catch((err) => {
      console.log('Erro ao adicionar tarefa:', err);
      if (setLoading) setLoading(false);
    });
};

// Função para atualizar uma tarefa existente
export const updateTask = (
  taskId: string,
  text: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setText: React.Dispatch<React.SetStateAction<string>>,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  axios
    .post(`${baseURL}/update`, { _id: taskId, text })
    .then(() => {
      setText('');
      setIsUpdating(false);
      getAllTasks(setTasks, setLoading);
    })
    .catch((err) => {
      console.log('Erro ao atualizar tarefa:', err);
      if (setLoading) setLoading(false);
    });
};

// Função para excluir uma tarefa
export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  axios
    .post(`${baseURL}/delete`, { _id })
    .then(() => {
      getAllTasks(setTasks, setLoading);
    })
    .catch((err) => {
      console.log('Erro ao excluir tarefa:', err);
      if (setLoading) setLoading(false);
    });
};