import { Hono } from 'hono';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';

const taskRouter = new Hono();
const taskController = new TaskController();

taskRouter.use(authenticate);

// Get tasks for a board with filtering
taskRouter.get('/', async (c) => taskController.getTasks(c));

// Create a new task
taskRouter.post('/', async (c) => taskController.createTask(c));

// Update a task
taskRouter.put('/', async (c) => taskController.updateTask(c));

// Delete a task
taskRouter.delete('/', async (c) => taskController.deleteTask(c));

// Batch update task positions (for drag and drop)
taskRouter.patch('/positions', async (c) =>
  taskController.updateTaskPositions(c)
);

// Get overdue tasks for a user
taskRouter.get('/overdue', async (c) => taskController.getOverdueTasks(c));

// Get task analytics for a user
taskRouter.get('/analytics', async (c) => taskController.getTaskAnalytics(c));

export default taskRouter;
