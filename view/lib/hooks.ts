import { Board, Task, Workspace } from '@/types';
import useSWR, { mutate as globalMutate } from 'swr';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Generic fetcher function with proper error handling
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
      // Add auth header if needed
      // 'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Generic hook for any async operation
export function useAsync<T>(
  key: string | null,
  customFetcher?: () => Promise<T>
) {
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate
  } = useSWR(key, customFetcher || (key ? () => fetcher(key) : null), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000
  });

  return {
    data: data as T,
    error,
    isLoading,
    mutate: swrMutate
  };
}

// Workspace hooks
export function useWorkspaces(userId?: number) {
  const { data, error, isLoading, mutate } = useSWR<Workspace[]>(
    userId ? `${API_BASE}/api/workspaces?userId=${userId}` : null,
    fetcher
  );

  const createWorkspace = async (workspaceData: {
    name: string;
    memberIds: (number | undefined)[];
  }) => {
    const response = await fetch(`${API_BASE}/api/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...workspaceData, admin: userId })
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to create workspace');
    }

    const newWorkspace = await response.json();
    mutate(); // Revalidate the data
    return newWorkspace;
  };

  const updateWorkspace = async (
    id: number,
    workspaceData: { name: string }
  ) => {
    const response = await fetch(`${API_BASE}/api/workspaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workspaceData)
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to update workspace');
    }

    const updatedWorkspace = await response.json();
    mutate(); // Revalidate the data
    return updatedWorkspace;
  };

  const deleteWorkspace = async (id: number) => {
    const response = await fetch(`${API_BASE}/api/workspaces/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete workspace');
    }

    mutate(); // Revalidate the data
  };

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

export function useWorkspace(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Workspace>(
    id ? `${API_BASE}/api/workspaces/${id}` : null,
    fetcher
  );

  return {
    workspace: data,
    error,
    isLoading,
    mutate
  };
}

// Board hooks
export function useBoards(workspaceId?: number) {
  const url = workspaceId
    ? `${API_BASE}/api/workspaces/${workspaceId}/boards`
    : `${API_BASE}/api/boards`;

  const { data, error, isLoading, mutate } = useSWR<Board[]>(url, fetcher);

  const createBoard = async (boardData: {
    title: string;
    workspaceId: number;
  }) => {
    const response = await fetch(
      `${API_BASE}/api/workspaces/${boardData.workspaceId}/boards`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: boardData.title }) // Only send title
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to create board');
    }

    const newBoard = await response.json();
    mutate(); // Revalidate the data
    return newBoard;
  };

  const updateBoard = async (
    id: number,
    workspaceId: number,
    boardData: { title: string }
  ) => {
    const response = await fetch(
      `${API_BASE}/api/workspaces/${workspaceId}/boards/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boardData)
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to update board');
    }

    const updatedBoard = await response.json();
    mutate(); // Revalidate the data
    return updatedBoard;
  };

  const deleteBoard = async (id: number, workspaceId: number) => {
    const response = await fetch(
      `${API_BASE}/api/workspaces/${workspaceId}/boards/${id}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete board');
    }

    mutate(); // Revalidate the data
  };

  return {
    boards: data,
    error,
    isLoading,
    createBoard,
    updateBoard,
    deleteBoard,
    mutate
  };
}

export function useBoard(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Board>(
    id ? `${API_BASE}/api/boards/${id}` : null,
    fetcher
  );

  return {
    board: data,
    error,
    isLoading,
    mutate
  };
}

// Task hooks
export function useTasks(boardId?: number) {
  const url = boardId
    ? `${API_BASE}/api/boards/${boardId}/tasks`
    : `${API_BASE}/api/tasks`;

  const { data, error, isLoading, mutate } = useSWR<Task[]>(url, fetcher);

  const createTask = async (taskData: {
    title: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status: string;
    boardId: number;
  }) => {
    const { boardId, ...requestData } = taskData; // Extract boardId for URL

    // Format the request data to match the API exactly
    const formattedData = {
      title: requestData.title,
      description: requestData.description,
      labels: requestData.labels || [],
      dueDate: requestData.dueDate,
      assignedTo: requestData.assignedTo,
      status: requestData.status
    };

    const response = await fetch(`${API_BASE}/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to create task');
    }

    const newTask = await response.json();
    mutate(); // Revalidate the data
    return newTask;
  };

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
  ) => {
    const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to update task');
    }

    const updatedTask = await response.json();
    mutate(); // Revalidate the data

    // Also revalidate board data if we're updating task status
    if (taskData.status && boardId) {
      globalMutate(`${API_BASE}/api/boards/${boardId}`);
    }

    return updatedTask;
  };

  const deleteTask = async (id: number) => {
    const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete task');
    }

    mutate(); // Revalidate the data
  };

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

export function useTask(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    id ? `${API_BASE}/api/tasks/${id}` : null,
    fetcher
  );

  return {
    task: data,
    error,
    isLoading,
    mutate
  };
}

// Dashboard/Analytics hooks
export function useDashboardStats() {
  const { data, error, isLoading } = useSWR<{
    workspaces: number;
    boards: number;
    tasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksThisWeek: number;
  }>(`${API_BASE}/api/dashboard/stats`, fetcher);

  return {
    stats: data,
    error,
    isLoading
  };
}

export function useRecentActivity() {
  const { data, error, isLoading } = useSWR<
    Array<{
      id: number;
      type:
        | 'task_created'
        | 'task_completed'
        | 'board_created'
        | 'workspace_joined';
      title: string;
      description: string;
      timestamp: string;
    }>
  >(`${API_BASE}/api/dashboard/activity`, fetcher);

  return {
    activities: data,
    error,
    isLoading
  };
}

// Board analytics hook
export function useBoardAnalytics(boardId: number | null) {
  const { data, error, isLoading } = useSWR<{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksByStatus: Record<string, number>;
    completionRate: number;
  }>(boardId ? `${API_BASE}/api/boards/${boardId}/analytics` : null, fetcher);

  return {
    analytics: data,
    error,
    isLoading
  };
}

// User task analytics hook
export function useUserTaskAnalytics(
  userId: number | null,
  workspaceId?: number
) {
  const params = workspaceId ? `?workspaceId=${workspaceId}` : '';
  const { data, error, isLoading } = useSWR<{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksByStatus: Record<string, number>;
    completionRate: number;
  }>(
    userId ? `${API_BASE}/api/users/${userId}/tasks/analytics${params}` : null,
    fetcher
  );

  return {
    analytics: data,
    error,
    isLoading
  };
}

// Overdue tasks hook
export function useOverdueTasks(userId: number | null) {
  const { data, error, isLoading } = useSWR<Task[]>(
    userId ? `${API_BASE}/api/users/${userId}/tasks/overdue` : null,
    fetcher
  );

  return {
    overdueTasks: data,
    error,
    isLoading
  };
}

// Workspace search hook
export function useWorkspaceSearch(query: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString()
  });

  const { data, error, isLoading } = useSWR<{
    workspaces: Workspace[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>(
    query ? `${API_BASE}/api/workspaces/search?${params.toString()}` : null,
    fetcher
  );

  return {
    searchResults: data,
    error,
    isLoading
  };
}

// Task position update hook
export function useTaskPositions() {
  const updateTaskPositions = async (
    tasks: { id: number; position: number; status: string }[]
  ) => {
    const response = await fetch(`${API_BASE}/api/tasks/positions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to update task positions');
    }

    return response.json();
  };

  return {
    updateTaskPositions
  };
}

// Global mutate functions for cross-component updates
export const invalidateWorkspaces = () =>
  globalMutate(`${API_BASE}/api/workspaces`);
export const invalidateBoards = (workspaceId?: number) => {
  const pattern = workspaceId
    ? `${API_BASE}/api/workspaces/${workspaceId}/boards`
    : `${API_BASE}/api/boards`;
  globalMutate(pattern);
};
export const invalidateTasks = (boardId?: number) => {
  const pattern = boardId
    ? `${API_BASE}/api/boards/${boardId}/tasks`
    : `${API_BASE}/api/tasks`;
  globalMutate(pattern);
};
