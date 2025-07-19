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

  async getBoards({
    c,
    boardId,
    workspaceId
  }: {
    c: Context;
    boardId?: number;
    workspaceId?: number;
  }) {
    const userId = c.get('user')?.id;

    try {
      const boards = await boardService.getBoards({
        userId,
        workspaceId,
        boardId
      });
      // const workspace = await prisma.workspace.findUnique({
      //   where: { id: workspaceId },
      //   select: {
      //     id: true,
      //     name: true,
      //     members: {
      //       select: {
      //         id: true,
      //         username: true,
      //         email: true
      //       }
      //     }
      //   }
      // });
      return c.json({ boards });
    } catch (error) {
      console.error('Get boards error:', error);
      return c.json({ error: 'Failed to fetch boards' }, 500);
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
