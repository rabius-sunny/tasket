import { useAsync } from '@/lib/hooks';
import requests from '@/lib/http';
import { handleAction } from '@/lib/utils';
import { Board } from '@/types';

export function useBoards(workspaceId?: number, boardId?: number) {
  const {
    data: board,
    error: boardError,
    isLoading: boardLoading
  } = useAsync<Board>(boardId ? `/boards/${boardId}` : null);

  const { data, error, isLoading, mutate } = useAsync<Board[]>(
    `/workspaces/${workspaceId}/boards`
  );

  const createBoard = async (boardData: {
    title: string;
    workspaceId: number;
  }) =>
    handleAction(async () => {
      const response = await requests.post(
        `/workspaces/${boardData.workspaceId}/boards`,
        { title: boardData.title }
      );

      mutate();
      return response;
    }, 'createBoard');

  const updateBoard = async (
    id: number,
    workspaceId: number,
    boardData: { title: string }
  ) =>
    handleAction(async () => {
      const response = await requests.put(
        `/workspaces/${workspaceId}/boards/${id}`,
        boardData
      );
      mutate();
      return response;
    }, 'updateBoard');

  const deleteBoard = async (id: number, workspaceId: number) =>
    handleAction(async () => {
      await requests.delete(`/workspaces/${workspaceId}/boards/${id}`);
      mutate();
    }, 'deleteBoard');

  return {
    boards: data,
    board,
    error: boardError || error,
    isLoading: boardLoading || isLoading,
    createBoard,
    updateBoard,
    deleteBoard,
    mutate
  };
}
