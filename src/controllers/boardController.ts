import { Context } from 'hono';
import prisma from '../lib/prisma';
import { boardService } from '../services/boardService';

export class BoardController {
  async createBoard(c: Context) {
    const userId = c.get('user')?.id;
    const boardData = await c.req.json();
    try {
      const { title, workspaceId } = boardData;

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: {
          members: {
            where: { id: userId },
            select: { id: true }
          }
        }
      });
      if (!workspace || workspace.members.length === 0) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      await prisma.board.create({
        data: {
          title,
          workspaceId
        }
      });

      return c.json({ ok: true }, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create board' }, 500);
    }
  }

  async getBoards(c: Context) {
    const userId = c.get('user')?.id;
    const boardId = Number(c.req.query('id'));
    const workspaceId = Number(c.req.query('workspaceId'));

    try {
      const boards = await boardService.getBoards({
        userId,
        workspaceId,
        boardId
      });

      if (workspaceId) {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId, members: { some: { id: userId } } },
          select: {
            id: true,
            name: true,
            members: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        });

        return c.json({ boards, workspace });
      }

      return c.json({ boards });
    } catch (error) {
      return c.json({ error: 'Failed to fetch boards' }, 500);
    }
  }

  async updateBoard(c: Context) {
    try {
      const boardData = await c.req.json();
      const { id, title } = boardData;
      const userId = c.get('user')?.id;

      await prisma.board.update({
        where: {
          id,
          // TODO: de-normalize users on boards for faster query
          // user must be a member of the workspace to update the board
          workspace: {
            members: {
              some: {
                id: userId
              }
            }
          }
        },
        data: { title }
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to update board' }, 500);
    }
  }

  async deleteBoard(c: Context) {
    const userId = c.get('user')?.id;
    const boardId = Number(c.req.query('boardId'));

    try {
      await prisma.board.delete({
        where: {
          id: boardId,
          // TODO: de-normalize users on boards for faster query
          // user must be a member of the workspace to delete the board
          workspace: {
            members: {
              some: {
                id: userId
              }
            }
          }
        }
      });

      return c.json({ message: 'Board deleted successfully' }, 200);
    } catch (error) {
      return c.json({ error: 'Failed to delete board' }, 500);
    }
  }

  async getBoardAnalytics(c: Context) {
    try {
      const boardId = Number(c.req.query('id'));
      const analytics = await boardService.getBoardAnalytics(boardId);

      return c.json(analytics);
    } catch (error) {
      return c.json({ error: 'Failed to fetch board analytics' }, 500);
    }
  }
}
