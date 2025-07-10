import { Context } from 'hono';
import prisma from '../lib/prisma';
import { boardService } from '../services/boardService';

export class BoardController {
  async createBoard(workspaceId: number, boardData: any, c: Context) {
    try {
      const { title } = boardData;

      const board = await prisma.board.create({
        data: {
          title,
          workspaceId
        },
        include: {
          workspace: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              tasks: true
            }
          }
        }
      });

      return c.json(board, 201);
    } catch (error) {
      console.error('Create board error:', error);
      return c.json({ error: 'Failed to create board' }, 500);
    }
  }

  async getBoards(workspaceId: number, c: Context) {
    try {
      const boards = await boardService.getBoardsByWorkspace(workspaceId);
      return c.json(boards);
    } catch (error) {
      console.error('Get boards error:', error);
      return c.json({ error: 'Failed to fetch boards' }, 500);
    }
  }

  async getBoard(boardId: number, c: Context) {
    try {
      const includeTasks = c.req.query('includeTasks') === 'true';

      if (includeTasks) {
        const board = await boardService.getBoardWithTasks(boardId);

        if (!board) {
          return c.json({ error: 'Board not found' }, 404);
        }

        return c.json(board);
      } else {
        const board = await prisma.board.findUnique({
          where: { id: boardId },
          include: {
            workspace: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                tasks: true
              }
            }
          }
        });

        if (!board) {
          // if (!board || board.workspaceId !== workspaceId) {
          return c.json({ error: 'Board not found' }, 404);
        }

        return c.json(board);
      }
    } catch (error) {
      console.error('Get board error:', error);
      return c.json({ error: 'Failed to fetch board' }, 500);
    }
  }

  async updateBoard(
    workspaceId: number,
    boardId: number,
    boardData: any,
    c: Context
  ) {
    try {
      const { title } = boardData;

      const board = await prisma.board.update({
        where: {
          id: boardId,
          workspaceId: workspaceId
        },
        data: { title },
        include: {
          workspace: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              tasks: true
            }
          }
        }
      });

      return c.json(board);
    } catch (error) {
      console.error('Update board error:', error);
      return c.json({ error: 'Failed to update board' }, 500);
    }
  }

  async deleteBoard(workspaceId: number, boardId: number, c: Context) {
    try {
      await prisma.board.delete({
        where: {
          id: boardId,
          workspaceId: workspaceId
        }
      });

      return c.json({ message: 'Board deleted successfully' });
    } catch (error) {
      console.error('Delete board error:', error);
      return c.json({ error: 'Failed to delete board' }, 500);
    }
  }

  async getBoardAnalytics(c: Context) {
    try {
      const boardId = parseInt(c.req.param('boardId'));
      const analytics = await boardService.getBoardAnalytics(boardId);

      return c.json(analytics);
    } catch (error) {
      console.error('Get board analytics error:', error);
      return c.json({ error: 'Failed to fetch board analytics' }, 500);
    }
  }
}
