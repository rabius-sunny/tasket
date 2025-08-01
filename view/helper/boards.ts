import { useAsync } from '@/lib/hooks';
import requests from '@/lib/http';
import { handleAction } from '@/utils/random';

export function useBoards<T = any>(workspaceId?: number, boardId?: number) {
  const { data, error, isLoading, mutate } = useAsync<T>(
    `/boards?id=${boardId}&workspaceId=${workspaceId}`
  );

  const createBoard = async (boardData: {
    title: string;
    workspaceId: number;
  }) =>
    handleAction(async () => {
      const response = await requests.post(`/boards`, {
        title: boardData.title,
        workspaceId: boardData.workspaceId
      });

      mutate();
      return response;
    }, 'createBoard');

  const updateBoard = async (boardData: { id: string; title: string }) =>
    handleAction(async () => {
      const response = await requests.put(`/boards`, boardData);
      mutate();
      return response;
    }, 'updateBoard');

  const deleteBoard = async (id: number, workspaceId: number) =>
    handleAction(async () => {
      await requests.delete(`/workspaces/${workspaceId}/boards/${id}`);
      mutate();
    }, 'deleteBoard');

  return {
    data,
    error,
    isLoading,
    createBoard,
    updateBoard,
    deleteBoard,
    mutate
  };
}
