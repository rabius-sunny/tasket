import { Context } from 'hono';
import prisma from '../lib/prisma';
import { workspaceService } from '../services/workspaceService';

export class WorkspaceController {
  async createWorkspace(c: Context) {
    try {
      const { name, memberIds, admin } = await c.req.json();

      const workspace = await prisma.workspace.create({
        data: {
          name,
          admin,
          members: {
            connect: memberIds?.map((id: number) => ({ id })) || []
          }
        },
        include: {
          members: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          _count: {
            select: {
              boards: true
            }
          }
        }
      });

      return c.json(workspace, 201);
    } catch (error) {
      console.error('Create workspace error:', error);
      return c.json({ error: 'Failed to create workspace' }, 500);
    }
  }

  async getAllWorkspaces(c: Context) {
    try {
      const userId = c.get('user');

      const workspaces = await workspaceService.getWorkspacesList(1);
      return c.json(workspaces);
    } catch (error) {
      console.error('Get workspaces error:', error);
      return c.json({ error: 'Failed to fetch workspaces' }, 500);
    }
  }

  async getWorkspaceById(c: Context) {
    try {
      const workspaceId = parseInt(c.req.param('id'));
      const includeFullData = c.req.query('includeFullData') === 'true';

      if (includeFullData) {
        const workspace = await workspaceService.getWorkspaceWithFullData(
          workspaceId
        );

        if (!workspace) {
          return c.json({ error: 'Workspace not found' }, 404);
        }

        return c.json(workspace);
      } else {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
          include: {
            members: {
              select: {
                id: true,
                username: true,
                email: true
              }
            },
            _count: {
              select: {
                boards: true
              }
            }
          }
        });

        if (!workspace) {
          return c.json({ error: 'Workspace not found' }, 404);
        }

        return c.json(workspace);
      }
    } catch (error) {
      console.error('Get workspace error:', error);
      return c.json({ error: 'Failed to fetch workspace' }, 500);
    }
  }

  async updateWorkspace(c: Context) {
    try {
      const workspaceId = parseInt(c.req.param('id'));
      const { name } = await c.req.json();

      const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: { name },
        include: {
          members: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          _count: {
            select: {
              boards: true
            }
          }
        }
      });

      return c.json(workspace);
    } catch (error) {
      console.error('Update workspace error:', error);
      return c.json({ error: 'Failed to update workspace' }, 500);
    }
  }

  async deleteWorkspace(c: Context) {
    try {
      const workspaceId = parseInt(c.req.param('id'));

      await prisma.workspace.delete({
        where: { id: workspaceId }
      });

      return c.json({ message: 'Workspace deleted successfully' });
    } catch (error) {
      console.error('Delete workspace error:', error);
      return c.json({ error: 'Failed to delete workspace' }, 500);
    }
  }

  async searchWorkspaces(c: Context) {
    try {
      const query = c.req.query('q') || '';
      const userId = c.req.query('userId');
      const page = parseInt(c.req.query('page') || '1');
      const limit = parseInt(c.req.query('limit') || '10');

      if (!userId) {
        return c.json({ error: 'User ID is required' }, 400);
      }

      const workspaces = await workspaceService.searchWorkspaces(
        query,
        parseInt(userId),
        page,
        limit
      );

      return c.json(workspaces);
    } catch (error) {
      console.error('Search workspaces error:', error);
      return c.json({ error: 'Failed to search workspaces' }, 500);
    }
  }

  async addMemberToWorkspace(c: Context) {
    try {
      const workspaceId = parseInt(c.req.param('id'));
      const { userIds } = await c.req.json();

      const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          members: {
            connect: userIds.map((id: number) => ({ id }))
          }
        },
        include: {
          members: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return c.json(workspace);
    } catch (error) {
      console.error('Add member error:', error);
      return c.json({ error: 'Failed to add member to workspace' }, 500);
    }
  }

  async removeMemberFromWorkspace(c: Context) {
    try {
      const workspaceId = parseInt(c.req.param('id'));
      const { userIds } = await c.req.json();

      const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          members: {
            disconnect: userIds.map((id: number) => ({ id }))
          }
        },
        include: {
          members: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return c.json(workspace);
    } catch (error) {
      console.error('Remove member error:', error);
      return c.json({ error: 'Failed to remove member from workspace' }, 500);
    }
  }
}
