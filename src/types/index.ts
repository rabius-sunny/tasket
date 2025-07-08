export interface Workspace {
  id: number;
  name: string;
  members: User[];
  boards: Board[];
}

export interface Board {
  id: number;
  title: string;
  workspaceId: number;
  workspace: Workspace;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: Date;
  attachments: string[];
  comments: Comment[];
  boardId: number;
  board: Board;
  checklists: Checklist[];
}

export interface Checklist {
  id: number;
  title: string;
  taskId: number;
  task: Task;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: number;
  title: string;
  dueDate?: Date;
  assignedTo?: number;
  checklistId: number;
  checklist: Checklist;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  task: Task;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  workspaces: Workspace[];
}