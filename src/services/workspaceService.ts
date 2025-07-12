import { Workspace } from '@prisma/client';
import prisma from '../lib/prisma';

export class WorkspaceService {
  // Optimized query to get workspace with all related data in one query
  async getWorkspaceWithFullData(
    workspaceId: number
  ): Promise<Workspace | null> {
    return await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        boards: {
          include: {
            tasks: {
              include: {
                checklists: {
                  include: {
                    items: {
                      include: {
                        assignedUser: {
                          select: {
                            id: true,
                            username: true,
                            email: true
                          }
                        }
                      }
                    }
                  }
                },
                comments: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        username: true,
                        email: true
                      }
                    }
                  },
                  orderBy: {
                    createdAt: 'desc'
                  }
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true
                  }
                }
              },
              orderBy: {
                position: 'asc'
              }
            }
          },
          orderBy: {
            title: 'asc'
          }
        },
        members: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  // Optimized query for workspace list with minimal data
  async getWorkspacesList(userId: number) {
    return await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            id: userId
          }
        }
      },
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
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  // Batch create workspaces
  async createWorkspaces(
    workspacesData: { name: string; memberIds: number[]; admin: number }[]
  ) {
    return await prisma.$transaction(
      workspacesData.map(({ name, memberIds, admin }) =>
        prisma.workspace.create({
          data: {
            name,
            admin,
            members: {
              connect: memberIds.map((id) => ({ id }))
            }
          }
        })
      )
    );
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
