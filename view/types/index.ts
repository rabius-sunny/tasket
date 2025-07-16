export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  workspaces?: Workspace[];
  tasks?: Task[];
  checklistItems?: ChecklistItem[];
  comments?: Comment[];
  addRequests?: AddRequest[];
  activities?: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: number;
  name: string;
  members: User[];
  boards: Board[];
  _count?: {
    boards: number;
    members: number;
  };
}

export interface Board {
  id: number;
  title: string;
  workspaceId: number;
  workspace?: {
    id: number;
    name: string;
  };
  tasks: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: string;
  attachments: string[];
  boardId: number;
  assignee?: User[];
  status: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  checklists: Checklist[];
  comments: Comment[];
  _count?: {
    checklists: number;
    comments: number;
  };
}

export interface Checklist {
  id: number;
  title: string;
  taskId: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: number;
  title: string;
  dueDate?: string;
  assigneeId?: number;
  assignee?: User;
  checklistId: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AddRequest {
  id: number;
  workspaceId: number;
  workspace: Workspace;
  userId: number;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  userId: number;
  user: User;
  workspaceId: number;
  workspace: Workspace;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  assignedTo?: number;
  status: string; // Required in creation
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  assignedTo?: number;
  status?: string;
  position?: number;
}

export interface CreateBoardData {
  title: string;
}

export interface UpdateBoardData {
  title: string;
}

export interface CreateWorkspaceData {
  name: string;
}

export interface UpdateWorkspaceData {
  name: string;
}

export interface TaskPositionUpdate {
  id: number;
  position: number;
  status: string;
}

export interface UpdateTaskPositionsData {
  tasks: TaskPositionUpdate[];
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
