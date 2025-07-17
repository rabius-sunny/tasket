import { Hono } from 'hono';
import { WorkspaceController } from '../controllers/workspaceController';
import { authenticate } from '../middlewares/auth';

const app = new Hono();
const workspaceController = new WorkspaceController();

app.use(authenticate);

// Create a new workspace
app.post('/', async (c) => workspaceController.createWorkspace(c));

// Get all workspaces for a user
app.get('/', async (c) => workspaceController.getAllWorkspaces(c));

// Search workspaces
app.get('/search', async (c) => workspaceController.searchWorkspaces(c));

// Get a specific workspace
app.get('/:id', async (c) => workspaceController.getWorkspaceById(c));

// Update a workspace
app.put('/:id', async (c) => workspaceController.updateWorkspace(c));

// Delete a workspace
app.delete('/:id', async (c) => workspaceController.deleteWorkspace(c));

// Add members to workspace
app.post('/:id/members', async (c) =>
  workspaceController.addMemberToWorkspace(c)
);

// Remove members from workspace
app.delete('/:id/members', async (c) =>
  workspaceController.removeMemberFromWorkspace(c)
);

export default app;
