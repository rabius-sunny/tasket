import { Context } from 'hono';
import prisma from '../lib/prisma';
import { taskService } from '../services/taskService';

export class TaskController {
  async createTask(c: Context) {
    try {
      const { title, description, labels, dueDate, assignedTo, status } =
        await c.req.json();
      const boardId = c.req.param('boardId');

      const task = await prisma.task.create({
        data: {
          title,
          description,
          labels: labels || [],
          dueDate: dueDate ? new Date(dueDate) : null,
          boardId: parseInt(boardId),
          assignedTo: assignedTo ? parseInt(assignedTo) : null,
          status: status || 'todo'
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          _count: {
            select: {
              checklists: true,
              comments: true
            }
          }
        }
      });

      return c.json(task, 201);
    } catch (error) {
      console.error('Create task error:', error);
      return c.json({ error: 'Failed to create task' }, 500);
    }
  }

  async getTasks(c: Context) {
    try {
      const boardId = parseInt(c.req.param('boardId'));
      const { status, assignedTo, search, overdue } = c.req.query();

      const filters: any = {};
      if (status) filters.status = status;
      if (assignedTo) filters.assignedTo = parseInt(assignedTo);
      if (search) filters.search = search;
      if (overdue === 'true') filters.hasOverdueDate = true;

      const tasks = await taskService.getTasksByBoard(boardId, filters);
      return c.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      return c.json({ error: 'Failed to fetch tasks' }, 500);
    }
  }

  async getTask(c: Context) {
    try {
      const taskId = parseInt(c.req.param('taskId'));
      const task = await taskService.getTaskWithRelations(taskId);

      if (!task) {
        return c.json({ error: 'Task not found' }, 404);
      }

      return c.json(task);
    } catch (error) {
      console.error('Get task error:', error);
      return c.json({ error: 'Failed to fetch task' }, 500);
    }
  }

  async updateTask(c: Context) {
    try {
      const taskId = parseInt(c.req.param('taskId'));
      const {
        title,
        description,
        labels,
        dueDate,
        assignedTo,
        status,
        position
      } = await c.req.json();

      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(labels && { labels }),
          ...(dueDate !== undefined && {
            dueDate: dueDate ? new Date(dueDate) : null
          }),
          ...(assignedTo !== undefined && {
            assignedTo: assignedTo ? parseInt(assignedTo) : null
          }),
          ...(status && { status }),
          ...(position !== undefined && { position: parseInt(position) })
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          _count: {
            select: {
              checklists: true,
              comments: true
            }
          }
        }
      });

      return c.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      return c.json({ error: 'Failed to update task' }, 500);
    }
  }

  async deleteTask(c: Context) {
    try {
      const taskId = parseInt(c.req.param('taskId'));

      await prisma.task.delete({
        where: { id: taskId }
      });

      return c.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      return c.json({ error: 'Failed to delete task' }, 500);
    }
  }

  async updateTaskPositions(c: Context) {
    try {
      const { tasks } = await c.req.json();

      await taskService.updateTaskPositions(tasks);

      return c.json({ message: 'Task positions updated successfully' });
    } catch (error) {
      console.error('Update task positions error:', error);
      return c.json({ error: 'Failed to update task positions' }, 500);
    }
  }

  async getOverdueTasks(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'));
      const overdueTasks = await taskService.getOverdueTasks(userId);

      return c.json(overdueTasks);
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      return c.json({ error: 'Failed to fetch overdue tasks' }, 500);
    }
  }

  async getTaskAnalytics(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'));
      const workspaceId = c.req.query('workspaceId');

      const analytics = await taskService.getTaskAnalytics(
        userId,
        workspaceId ? parseInt(workspaceId) : undefined
      );

      return c.json(analytics);
    } catch (error) {
      console.error('Get task analytics error:', error);
      return c.json({ error: 'Failed to fetch task analytics' }, 500);
    }
  }
}
