import { useAsync } from '@/lib/hooks';
import requests from '@/lib/http';
import { Workspace } from '@/types';
import { handleAction } from '@/utils/random';

export function useWorkspaces() {
  const { data, error, isLoading, mutate } =
    useAsync<Workspace[]>(`/workspaces`);

  const createWorkspace = (workspaceData: {
    name: string;
    memberIds: (number | undefined)[];
  }) =>
    handleAction(async () => {
      const response = await requests.post('/workspaces', {
        ...workspaceData
      });
      mutate();
      return response;
    }, 'createWorkspace');

  const updateWorkspace = (id: number, workspaceData: { name: string }) =>
    handleAction(async () => {
      const response = await requests.put(`/workspaces/${id}`, workspaceData);
      mutate();
      return response;
    }, 'updateWorkspace');

  const deleteWorkspace = (id: number) =>
    handleAction(async () => {
      await requests.delete(`/workspaces/${id}`);
      mutate();
    }, 'deleteWorkspace');

  return {
    workspaces: data,
    error,
    isLoading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    mutate
  };
}
