import { Hono } from 'hono';
import { WorkspaceController } from '../controllers/workspaceController';
import { authenticate } from '../middlewares/auth';

const workspaceRouter = new Hono();
const workspaceController = new WorkspaceController();

workspaceRouter.use(authenticate);

// Create a new workspace
workspaceRouter.post('/', async (c) => workspaceController.createWorkspace(c));

// Get workspaces for a user
workspaceRouter.get('/', async (c) => workspaceController.getAllWorkspaces(c));

// Search workspaces
workspaceRouter.get('/search', async (c) =>
  workspaceController.searchWorkspaces(c)
);

// Update a workspace
workspaceRouter.put('/', async (c) => workspaceController.updateWorkspace(c));

// Add members to workspace
workspaceRouter.put('/members', async (c) =>
  workspaceController.updateMembersToWorkspace(c)
);

// Delete a workspace
workspaceRouter.delete('/', async (c) =>
  workspaceController.deleteWorkspace(c)
);

export default workspaceRouter;
