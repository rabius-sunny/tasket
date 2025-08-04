import { Context } from 'hono';
import prisma from '../lib/prisma';
import { taskService } from '../services/taskService';

export class TaskController {
  async createTask(c: Context) {
    try {
      const { title, description, labels, dueDate, userIds, status, boardId } =
        await c.req.json();

      // TODO: separate this fetching with caching
      const workspace = await prisma.workspace.findFirst({
        where: { boards: { some: { id: Number(boardId) } } },
        select: {
          members: {
            select: { id: true }
          }
        }
      });

      if (!workspace) return c.json({ error: 'Workspace not found' }, 404);

      // Get the next position for the status in this board
      const lastTask = await prisma.task.findFirst({
        where: {
          boardId: Number(boardId),
          status: status || 'todo'
        },
        orderBy: { position: 'desc' }
      });

      const nextPosition = (lastTask?.position || 0) + 1;

      await prisma.task.create({
        data: {
          title,
          description,
          labels: {
            set: labels ? labels.map((label: string) => label.trim()) : []
          },
          dueDate: dueDate ? new Date(dueDate) : null,
          board: {
            connect: { id: Number(boardId) }
          },
          assignee: {
            connect: userIds
              ? userIds.map((id: any) => ({ id: Number(id) }))
              : []
          },
          // de-normalize userIds for easier querying
          userIds: workspace.members
            ? workspace.members.map((item) => item.id)
            : [],
          status: status || 'todo',
          position: nextPosition
        }
      });

      return c.json({ ok: true }, 201);
    } catch (error) {
      console.error('Error creating task:', error);
      return c.json({ error: 'Failed to create task' }, 500);
    }
  }

  async getTasks(c: Context) {
    const userId = c.get('user')?.id;

    try {
      const { id, status, assignedTo, search, overdue, boardId } =
        c.req.query();

      if (!boardId) return c.json({ error: 'Board ID is required' }, 400);

      if (id) {
        const task = await taskService.getTaskWithRelations(
          Number(id),
          Number(boardId),
          Number(userId)
        );

        return c.json(task);
      }

      const filters: any = {};
      if (status) filters.status = status;
      if (assignedTo) filters.assignedTo = Number(assignedTo);
      if (search) filters.search = search;
      if (overdue === 'true') filters.hasOverdueDate = true;

      const tasks = await taskService.getTasksByBoard(
        Number(boardId),
        Number(userId),
        filters
      );
      return c.json(tasks);
    } catch (error) {
      return c.json({ error: 'Failed to fetch tasks' }, 500);
    }
  }

  async updateTask(c: Context) {
    const userId = c.get('user')?.id;

    try {
      const { id, ...rest } = await c.req.json();

      await prisma.task.update({
        where: { id, userIds: { has: Number(userId) } },
        data: rest
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to update task' }, 500);
    }
  }

  async deleteTask(c: Context) {
    const userId = c.get('user')?.id;
    try {
      const id = Number(c.req.query('id'));

      await prisma.task.delete({
        where: { id, userIds: { has: Number(userId) } }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to delete task' }, 500);
    }
  }

  async updateTaskPositions(c: Context) {
    const userId = c.get('user')?.id;
    try {
      const { tasks } = await c.req.json();

      await taskService.updateTaskPositions(tasks, Number(userId));

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to update task positions' }, 500);
    }
  }

  async getOverdueTasks(c: Context) {
    try {
      const userId = Number(c.req.query('userId'));
      const overdueTasks = await taskService.getOverdueTasks(userId);

      return c.json(overdueTasks);
    } catch (error) {
      return c.json({ error: 'Failed to fetch overdue tasks' }, 500);
    }
  }

  async getTaskAnalytics(c: Context) {
    try {
      const userId = Number(c.req.query('userId'));
      const workspaceId = c.req.query('workspaceId');

      const analytics = await taskService.getTaskAnalytics(
        userId,
        workspaceId ? Number(workspaceId) : undefined
      );

      return c.json(analytics);
    } catch (error) {
      return c.json({ error: 'Failed to fetch task analytics' }, 500);
    }
  }
}
