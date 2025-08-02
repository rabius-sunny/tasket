import { Context } from 'hono';
import prisma from '../lib/prisma';

export class ChecklistItemController {
  async createChecklistItem(c: Context) {
    const userId = c.get('user')?.id;
    const checklistItemData = await c.req.json();

    try {
      const { title, checklistId } = checklistItemData;

      // Validate checklist ownership
      const checklist = await prisma.checklist.findFirst({
        where: { userIds: { has: Number(userId) } },
        select: { id: true }
      });

      if (!checklist) {
        return c.json({ error: 'You are not a member of the workspace' }, 403);
      }

      await prisma.checklistItem.create({
        data: {
          title,
          checklistId
        }
      });

      return c.json({ ok: true }, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create checklist item' }, 500);
    }
  }

  async getChecklistItems(c: Context) {
    const checklistId = Number(c.req.query('checklistId'));

    if (!checklistId) return c.json({ error: 'Checklist ID is required' }, 400);

    try {
      const items = await prisma.checklistItem.findMany({
        where: { checklistId }
      });

      return c.json(items);
    } catch (error) {
      return c.json({ error: 'Failed to fetch checklist items' }, 500);
    }
  }

  async updateChecklistItem(c: Context) {
    const itemData = await c.req.json();
    const { id, title } = itemData;
    const userId = c.get('user')?.id;

    // Validate checklist ownership
    const checklist = await prisma.checklist.findFirst({
      where: { userIds: { has: Number(userId) } },
      select: { id: true }
    });

    if (!checklist) {
      return c.json({ error: 'You are not a member of the workspace' }, 403);
    }

    try {
      await prisma.checklistItem.update({
        where: { id },
        data: { title }
      });

      return c.json({ ok: true });
    } catch (error) {
      return c.json({ error: 'Failed to update checklist item' }, 500);
    }
  }

  async deleteChecklistItem(c: Context) {
    const userId = c.get('user')?.id;
    const itemId = Number(c.req.query('itemId'));

    try {
      // Validate checklist ownership
      const checklist = await prisma.checklist.findFirst({
        where: { userIds: { has: Number(userId) } },
        select: { id: true }
      });

      if (!checklist) {
        return c.json({ error: 'You are not a member of the workspace' }, 403);
      }

      await prisma.checklistItem.delete({
        where: {
          id: itemId
        }
      });

      return c.json({ ok: true });
    } catch (error) {
      return c.json({ error: 'Failed to delete checklist item' }, 500);
    }
  }
}
