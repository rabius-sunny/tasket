import { Context } from 'hono';
import prisma from '../lib/prisma';

export class ChecklistController {
  async createChecklist(c: Context) {
    const userId = c.get('user')?.id;
    const checklistData = await c.req.json();

    try {
      const { title, taskId } = checklistData;

      // Validate task ownership
      const task = await prisma.task.findFirst({
        where: { userIds: { has: Number(userId) } },
        select: { userIds: true }
      });

      if (!task) {
        return c.json({ error: 'You are not a member of the workspace' }, 403);
      }

      await prisma.checklist.create({
        data: {
          title,
          taskId,
          userIds: task.userIds
        }
      });

      return c.json({ ok: true }, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create checklist' }, 500);
    }
  }

  async getChecklists(c: Context) {
    const taskId = Number(c.req.query('taskId'));

    if (!taskId) return c.json({ error: 'Task ID is required' }, 400);

    try {
      const checklists = await prisma.checklist.findMany({
        where: { taskId },
        include: { items: true }
      });

      return c.json(checklists);
    } catch (error) {
      return c.json({ error: 'Failed to fetch checklists' }, 500);
    }
  }
  async updateChecklist(c: Context) {
    const checklistData = await c.req.json();
    const { id, title } = checklistData;
    const userId = c.get('user')?.id;

    // Validate task ownership
    const task = await prisma.task.findFirst({
      where: { userIds: { has: Number(userId) } },
      select: { id: true }
    });

    if (!task) {
      return c.json({ error: 'You are not a member of the workspace' }, 403);
    }

    try {
      await prisma.checklist.update({
        where: { id },
        data: { title }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to update checklist' }, 500);
    }
  }

  async deleteChecklist(c: Context) {
    const checklistId = Number(c.req.query('checklistId'));
    const userId = c.get('user')?.id;

    // Validate task ownership
    const task = await prisma.task.findFirst({
      where: { userIds: { has: Number(userId) } },
      select: { id: true }
    });

    if (!task) {
      return c.json({ error: 'You are not a member of the workspace' }, 403);
    }

    try {
      await prisma.checklist.delete({
        where: { id: checklistId }
      });

      return c.json({ message: 'Checklist deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Failed to delete checklist' }, 500);
    }
  }
}
