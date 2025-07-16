import { Context } from 'hono';
import prisma from '../lib/prisma';

export class UserController {
  async getUserProfile(c: Context) {
    const userId = parseInt(c.req.param('userId'));

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      if (!user) {
        c.status(404);
        return c.json({ error: 'User not found' });
      }

      return c.json(user);
    } catch (error) {
      console.error('Get user profile error:', error);
      return c.json({ error: 'Failed to fetch user profile' }, 500);
    }
  }
  async updateUserProfile(c: Context) {
    const userId = parseInt(c.req.param('userId'));
    const body = await c.req.json();

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username: body.username,
          email: body.email
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      return c.json(updatedUser);
    } catch (error) {
      console.error('Update user profile error:', error);
      return c.json({ error: 'Failed to update user profile' }, 500);
    }
  }

  async getUsersForInvite(c: Context) {
    const workspaceId = parseInt(c.req.param('workspaceId'));

    if (!workspaceId) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          workspaces: {
            none: {
              id: workspaceId
            }
          }
        },
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      return c.json(users);
    } catch (error) {
      console.error('Get users for invite error:', error);
      return c.json({ error: 'Failed to fetch users for invite' }, 500);
    }
  }
}
