import { Hono } from 'hono';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';

const taskRouter = new Hono();
const taskController = new TaskController();

taskRouter.use(authenticate);

// Get tasks for a board with filtering
taskRouter.get('/boards/:boardId/tasks', async (c) =>
  taskController.getTasks(c)
);

// Create a new task
taskRouter.post('/boards/:boardId/tasks', async (c) =>
  taskController.createTask(c)
);

// Get a specific task with all relations
taskRouter.get('/tasks/:taskId', async (c) => taskController.getTask(c));

// Update a task
taskRouter.put('/tasks/:taskId', async (c) => taskController.updateTask(c));

// Delete a task
taskRouter.delete('/tasks/:taskId', async (c) => taskController.deleteTask(c));

// Batch update task positions (for drag and drop)
taskRouter.patch('/tasks/positions', async (c) =>
  taskController.updateTaskPositions(c)
);

// Get overdue tasks for a user
taskRouter.get('/users/:userId/tasks/overdue', async (c) =>
  taskController.getOverdueTasks(c)
);

// Get task analytics for a user
taskRouter.get('/users/:userId/tasks/analytics', async (c) =>
  taskController.getTaskAnalytics(c)
);

export default taskRouter;
