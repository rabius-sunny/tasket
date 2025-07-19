import prisma from '../lib/prisma';

export class WorkspaceService {
  static select = {
    select: {
      id: true,
      name: true,
      members: {
        select: {
          id: true,
          username: true
        }
      },
      _count: {
        select: {
          boards: true,
          members: true
        }
      }
    }
  };

  async getWorkspacesList(userId: number, workspaceId?: number) {
    return workspaceId
      ? prisma.workspace.findUnique({
          where: { id: workspaceId, members: { some: { id: userId } } },
          ...WorkspaceService.select
        })
      : prisma.workspace.findMany({
          where: {
            members: {
              some: {
                id: userId
              }
            }
          },
          ...WorkspaceService.select,
          orderBy: {
            name: 'asc'
          }
        });
  }

  // Optimized search with pagination
  async searchWorkspaces(
    query: string,
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    return await prisma.workspace.findMany({
      where: {
        AND: [
          {
            members: {
              some: {
                id: userId
              }
            }
          },
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            boards: true,
            members: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }
}

export const workspaceService = new WorkspaceService();
