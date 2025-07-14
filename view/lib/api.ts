import {
  AuthUser,
  Board,
  CreateBoardData,
  CreateTaskData,
  CreateWorkspaceData,
  LoginData,
  RegisterData,
  Task,
  UpdateBoardData,
  UpdateTaskData,
  UpdateTaskPositionsData,
  UpdateWorkspaceData,
  Workspace
} from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Network error' }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginData): Promise<{ user: AuthUser; message: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async register(data: RegisterData): Promise<AuthUser> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Workspace endpoints
  async getWorkspaces(userId?: number): Promise<Workspace[]> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/workspaces${params}`);
  }

  async getWorkspace(id: number, includeFullData = false): Promise<Workspace> {
    const query = includeFullData ? '?includeFullData=true' : '';
    return this.request(`/workspaces/${id}${query}`);
  }

  async createWorkspace(data: CreateWorkspaceData): Promise<Workspace> {
    return this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateWorkspace(
    id: number,
    data: UpdateWorkspaceData
  ): Promise<Workspace> {
    return this.request(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteWorkspace(id: number): Promise<{ message: string }> {
    return this.request(`/workspaces/${id}`, {
      method: 'DELETE'
    });
  }

  // Board endpoints
  async getBoards(workspaceId: number): Promise<Board[]> {
    return this.request(`/workspaces/${workspaceId}/boards`);
  }

  async getBoard(
    workspaceId: number,
    boardId: number,
    includeTasks = false
  ): Promise<Board> {
    const query = includeTasks ? '?includeTasks=true' : '';
    return this.request(`/workspaces/${workspaceId}/boards/${boardId}${query}`);
  }

  async createBoard(
    workspaceId: number,
    data: CreateBoardData
  ): Promise<Board> {
    return this.request(`/workspaces/${workspaceId}/boards`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateBoard(
    workspaceId: number,
    boardId: number,
    data: UpdateBoardData
  ): Promise<Board> {
    return this.request(`/workspaces/${workspaceId}/boards/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteBoard(
    workspaceId: number,
    boardId: number
  ): Promise<{ message: string }> {
    return this.request(`/workspaces/${workspaceId}/boards/${boardId}`, {
      method: 'DELETE'
    });
  }

  // Task endpoints
  async getTasks(
    boardId: number,
    filters?: {
      status?: string;
      assignedTo?: number;
      search?: string;
      overdue?: boolean;
    }
  ): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assignedTo)
      params.append('assignedTo', filters.assignedTo.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.overdue) params.append('overdue', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/boards/${boardId}/tasks${query}`);
  }

  async getTask(taskId: number): Promise<Task> {
    return this.request(`/tasks/${taskId}`);
  }

  async createTask(boardId: number, data: CreateTaskData): Promise<Task> {
    return this.request(`/boards/${boardId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data) // Remove boardId as it's in the URL
    });
  }

  async updateTask(taskId: number, data: UpdateTaskData): Promise<Task> {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTask(taskId: number): Promise<{ message: string }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async updateTaskPositions(data: UpdateTaskPositionsData): Promise<void> {
    return this.request('/tasks/positions', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

export const apiClient = new ApiClient();
