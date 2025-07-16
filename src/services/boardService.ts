import { Board } from '@prisma/client';
import prisma from '../lib/prisma';

export class BoardService {
  // Get board with optimized task loading
  async getBoardWithTasks(boardId: number): Promise<Board | null> {
    return await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        tasks: {
          include: {
            checklists: {
              include: {
                items: {
                  include: {
                    assignee: {
                      select: {
                        id: true,
                        username: true,
                        email: true
                      }
                    }
                  },
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              },
              orderBy: {
                title: 'asc'
              }
            },
            _count: {
              select: {
                comments: true
              }
            }
          },
          orderBy: [{ status: 'asc' }, { position: 'asc' }]
        },
        workspace: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  // Get boards with task counts (efficient for board listing)
  async getBoardsByWorkspace(workspaceId: number) {
    return await prisma.board.findMany({
      where: { workspaceId },
      select: {
        id: true,
        title: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true
          }
        },
        tasks: {
          where: {
            status: 'completed'
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Get board analytics
  async getBoardAnalytics(boardId: number) {
    const [taskCounts, overdueTasks, recentActivity] =
      await prisma.$transaction([
        // Task counts by status
        prisma.task.groupBy({
          by: ['status'],
          where: { boardId },
          _count: {
            id: true
          },
          orderBy: {
            status: 'asc'
          }
        }),

        // Overdue tasks count
        prisma.task.count({
          where: {
            boardId,
            dueDate: {
              lt: new Date()
            },
            status: {
              not: 'completed'
            }
          }
        }),

        // Recent activity (last 7 days)
        prisma.task.count({
          where: {
            boardId,
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

    return {
      taskCounts,
      overdueTasks,
      recentActivity
    };
  }
}

export const boardService = new BoardService();
