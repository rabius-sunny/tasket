import prisma from '../lib/prisma';

export class TaskService {
  // Get task with all relations in a single query
  async getTaskWithRelations(id: number, boardId: number, userId: number) {
    return await prisma.task.findUnique({
      where: { id, boardId, userIds: { has: userId } },
      select: {
        id: true,
        labels: true,
        attachments: true,
        createdAt: true,
        updatedAt: true,
        checklists: {
          select: {
            id: true,
            title: true,
            items: {
              select: {
                id: true,
                title: true,
                completed: true,
                dueDate: true,
                createdAt: true,
                assignee: {
                  select: {
                    username: true
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          },
          orderBy: {
            title: 'asc'
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  // Get tasks by board with optimized queries
  async getTasksByBoard(
    boardId: number,
    userId: number,
    filters?: {
      status?: string;
      assignedTo?: number;
      hasOverdueDate?: boolean;
      search?: string;
    }
  ) {
    const where: any = { boardId, userIds: { has: userId } };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    if (filters?.hasOverdueDate) {
      where.dueDate = {
        lt: new Date()
      };
    }

    if (filters?.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ];
    }

    return await prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        position: true,
        assignee: {
          select: {
            username: true
          }
        },
        _count: {
          select: {
            checklists: true,
            comments: true
          }
        }
      },
      orderBy: [{ position: 'asc' }]
    });
  }

  // Batch update task positions (for drag and drop)
  async updateTaskPositions(
    taskUpdates: { id: number; position: number; status?: string }[],
    userId: number
  ) {
    return await prisma.$transaction(
      taskUpdates.map(({ id, position, status }) =>
        prisma.task.update({
          where: { id, userIds: { has: userId } },
          data: {
            position,
            ...(status && { status })
          }
        })
      )
    );
  }

  // Get overdue tasks for a user
  async getOverdueTasks(userId: number) {
    return await prisma.task.findMany({
      where: {
        userIds: {
          has: userId
        },
        dueDate: {
          lt: new Date()
        },
        status: {
          not: 'completed'
        }
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        board: {
          select: {
            id: true,
            title: true,
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  }

  // Get task analytics for dashboard
  async getTaskAnalytics(userId: number, workspaceId?: number) {
    const baseWhere: any = {
      assignedTo: userId
    };

    if (workspaceId) {
      baseWhere.board = {
        workspaceId
      };
    }

    const [taskCounts, upcomingTasks, totalTasks] = await prisma.$transaction([
      // Task counts by status
      prisma.task.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: {
          id: true
        },
        orderBy: {
          status: 'asc'
        }
      }),

      // Upcoming tasks (next 7 days)
      prisma.task.findMany({
        where: {
          ...baseWhere,
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          status: {
            not: 'completed'
          }
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          board: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        },
        take: 10
      }),

      // Total tasks count (last 30 days)
      prisma.task.count({
        where: {
          ...baseWhere,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    return {
      taskCounts,
      upcomingTasks,
      totalTasks
    };
  }
}

export const taskService = new TaskService();
