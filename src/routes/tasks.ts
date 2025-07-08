import { Hono } from 'hono';
import { TaskController } from '../controllers/taskController';

const app = new Hono();
const taskController = new TaskController();

// Get tasks for a board with filtering
app.get('/boards/:boardId/tasks', async (c) => taskController.getTasks(c));

// Create a new task
app.post('/boards/:boardId/tasks', async (c) => taskController.createTask(c));

// Get a specific task with all relations
app.get('/tasks/:taskId', async (c) => taskController.getTask(c));

// Update a task
app.put('/tasks/:taskId', async (c) => taskController.updateTask(c));

// Delete a task
app.delete('/tasks/:taskId', async (c) => taskController.deleteTask(c));

// Batch update task positions (for drag and drop)
app.patch('/tasks/positions', async (c) =>
  taskController.updateTaskPositions(c)
);

// Get overdue tasks for a user
app.get('/users/:userId/tasks/overdue', async (c) =>
  taskController.getOverdueTasks(c)
);

// Get task analytics for a user
app.get('/users/:userId/tasks/analytics', async (c) =>
  taskController.getTaskAnalytics(c)
);

export default app;
