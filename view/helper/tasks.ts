import { useAsync } from '@/lib/hooks';
import requests from '@/lib/http';
import { Task } from '@/types';
import { handleAction } from '@/utils/random';
import { mutate as globalMutate } from 'swr';

export function useTasks(boardId?: number) {
  const { data, error, isLoading, mutate } = useAsync<Task[]>(
    () => boardId && `/tasks?boardId=${boardId}`
  );

  const createTask = async (taskData: {
    title: string;
    status: string;
    boardId: number;
  }) =>
    handleAction(async () => {
      const formattedData = {
        title: taskData.title,
        status: taskData.status,
        boardId: taskData.boardId
      };
      const response = await requests.post(`/tasks`, formattedData);
      mutate();
      return response;
    }, 'createTask');

  const updateTask = async (taskData: {
    id: number;
    title?: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status?: string;
    position?: number;
  }) =>
    handleAction(async () => {
      const response = await requests.put(`/tasks`, taskData);
      mutate();
      if (taskData.status && boardId) {
        globalMutate(`/boards/${boardId}`);
      }
      return response;
    }, 'updateTask');

  const deleteTask = async (id: number) =>
    handleAction(async () => {
      await requests.delete(`/tasks?id=${id}`);
      mutate();
    }, 'deleteTask');

  const updateTaskPositions = async (
    taskUpdates: Array<{ id: number; position: number; status?: string }>
  ) =>
    handleAction(async () => {
      await requests.patch('/tasks/positions', { tasks: taskUpdates });
      mutate();
    }, 'updateTaskPositions');

  return {
    tasks: data,
    error,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskPositions,
    mutate
  };
}
