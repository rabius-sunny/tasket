import { Context } from 'hono';
import prisma from '../lib/prisma';
import { workspaceService } from '../services/workspaceService';

export class WorkspaceController {
  async createWorkspace(c: Context) {
    try {
      const { name, memberIds } = await c.req.json();
      const userId = c.get('user')?.id;

      await prisma.workspace.create({
        data: {
          name,
          admin: Number(userId),
          members: {
            connect:
              [userId, ...(memberIds || [])].map((id: number) => ({ id })) || []
          }
        }
      });

      return c.json({ ok: true }, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create workspace' }, 500);
    }
  }

  async getAllWorkspaces(c: Context) {
    try {
      const user = c.get('user');
      const workspaceId = c.req.query('id');

      const workspaces = await workspaceService.getWorkspacesList(
        Number(user.id),
        workspaceId ? Number(workspaceId) : undefined
      );

      return c.json(workspaces);
    } catch (error) {
      return c.json({ error: 'Failed to fetch workspaces' }, 500);
    }
  }

  async updateWorkspace(c: Context) {
    try {
      const { id, name } = await c.req.json();
      const userId = c.get('user')?.id;

      await prisma.workspace.update({
        where: { id, admin: Number(userId) },
        data: { name }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to update workspace' }, 500);
    }
  }

  async searchWorkspaces(c: Context) {
    try {
      const query = c.req.query('q') || '';
      const userId = c.get('user')?.id;
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
      return c.json({ error: 'Failed to search workspaces' }, 500);
    }
  }

  async updateMembersToWorkspace(c: Context) {
    try {
      const userId = c.get('user')?.id;
      const { id, adds, removes } = await c.req.json();

      const connect = Array.isArray(adds)
        ? adds
            .filter((id: number | undefined) => id !== undefined)
            .map((id: number) => ({ id }))
        : [];
      const disconnect = Array.isArray(removes)
        ? removes
            .filter((id: number | undefined) => id !== undefined)
            .map((id: number) => ({ id }))
        : [];

      await prisma.workspace.update({
        where: { id, admin: Number(userId) },
        data: {
          members: {
            ...(connect.length > 0 && { connect }),
            ...(disconnect.length > 0 && { disconnect })
          }
        }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      console.log('error', error);
      return c.json({ error: 'Failed to update members in workspace' }, 500);
    }
  }

  async deleteWorkspace(c: Context) {
    try {
      const workspaceId = c.req.query('id');
      const userId = c.get('user')?.id;

      if (!workspaceId)
        return c.json({ error: 'Workspace ID is required' }, 400);

      await prisma.workspace.delete({
        where: { id: Number(workspaceId), admin: Number(userId) }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to delete workspace' }, 500);
    }
  }
}
