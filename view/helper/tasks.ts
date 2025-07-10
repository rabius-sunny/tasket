import { useAsync } from '@/lib/hooks';
import requests from '@/lib/http';
import { handleAction } from '@/lib/utils';
import { Task } from '@/types';
import { mutate as globalMutate } from 'swr';

export function useTasks(boardId?: number) {
  const { data, error, isLoading, mutate } = useAsync<Task[]>(
    `/boards/${boardId}/tasks`
  );

  const createTask = async (taskData: {
    title: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status: string;
    boardId: number;
  }) =>
    handleAction(async () => {
      const { boardId, ...requestData } = taskData;
      const formattedData = {
        title: requestData.title,
        description: requestData.description,
        labels: requestData.labels || [],
        dueDate: requestData.dueDate,
        assignedTo: requestData.assignedTo,
        status: requestData.status
      };
      const response = await requests.post(
        `/boards/${boardId}/tasks`,
        formattedData
      );
      mutate();
      return response;
    }, 'createTask');

  const updateTask = async (
    id: number,
    taskData: {
      title?: string;
      description?: string;
      labels?: string[];
      dueDate?: string;
      assignedTo?: number;
      status?: string;
      position?: number;
    }
  ) =>
    handleAction(async () => {
      const response = await requests.put(`/tasks/${id}`, taskData);
      mutate();
      if (taskData.status && boardId) {
        globalMutate(`/boards/${boardId}`);
      }
      return response;
    }, 'updateTask');

  const deleteTask = async (id: number) =>
    handleAction(async () => {
      await requests.delete(`/tasks/${id}`);
      mutate();
    }, 'deleteTask');

  return {
    tasks: data,
    error,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    mutate
  };
}
