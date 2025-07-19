import { Hono } from 'hono';
import { WorkspaceController } from '../controllers/workspaceController';
import { authenticate } from '../middlewares/auth';

const workspaceRouter = new Hono();
const workspaceController = new WorkspaceController();

workspaceRouter.use(authenticate);

// Create a new workspace
workspaceRouter.post('/', async (c) => workspaceController.createWorkspace(c));

// Get all workspaces for a user
workspaceRouter.get('/', async (c) => workspaceController.getAllWorkspaces(c));

// Search workspaces
workspaceRouter.get('/search', async (c) =>
  workspaceController.searchWorkspaces(c)
);

// Get a specific workspace
workspaceRouter.get('/:id', async (c) =>
  workspaceController.getWorkspaceById(c)
);

// Update a workspace
workspaceRouter.put('/:id', async (c) =>
  workspaceController.updateWorkspace(c)
);

// Delete a workspace
workspaceRouter.delete('/:id', async (c) =>
  workspaceController.deleteWorkspace(c)
);

// Add members to workspace
workspaceRouter.post('/:id/members', async (c) =>
  workspaceController.addMemberToWorkspace(c)
);

// Remove members from workspace
workspaceRouter.delete('/:id/members', async (c) =>
  workspaceController.removeMemberFromWorkspace(c)
);

export default workspaceRouter;
