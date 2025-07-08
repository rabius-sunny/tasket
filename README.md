# Tasket - Task Management API

A minimal yet powerful task management platform built with Bun, Hono, Prisma ORM, and PostgreSQL. This application provides a complete project management solution with workspaces, boards, tasks, and advanced features like checklists, comments, and analytics.

## Features

- **Workspaces**: Create and manage workspaces with multiple members
- **Boards**: Organize tasks within boards under workspaces
- **Tasks**: Full-featured task management with drag-and-drop support
- **Checklists**: Break down tasks into manageable checklist items
- **Comments**: Collaborative commenting system for tasks
- **User Management**: Secure authentication and user assignment
- **Analytics**: Dashboard analytics for productivity insights
- **Performance Optimized**: Database indexing and query optimization

See [DATABASE_OPTIMIZATION.md](DATABASE_OPTIMIZATION.md) for detailed technical information.

## Quick Start

1. **Clone and Setup**:

   ```bash
   git clone <repository-url>
   cd Tasket
   bun install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   # Update .env with your database credentials
   ```

3. **Database Setup**:

   ```bash
   bun run migrate
   bun run db:generate
   ```

4. **Start Development Server**:
   ```bash
   bun run dev
   ```

## API Endpoints

### 🏠 System Routes

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| GET    | `/health` | Health check endpoint |

### 🔐 Authentication Routes

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | User login          |

### 🏢 Workspace Routes

| Method | Endpoint                      | Description                               |
| ------ | ----------------------------- | ----------------------------------------- |
| POST   | `/api/workspaces`             | Create a new workspace                    |
| GET    | `/api/workspaces`             | Get all workspaces for authenticated user |
| GET    | `/api/workspaces/search`      | Search workspaces                         |
| GET    | `/api/workspaces/:id`         | Get specific workspace with full data     |
| PUT    | `/api/workspaces/:id`         | Update workspace details                  |
| DELETE | `/api/workspaces/:id`         | Delete workspace                          |
| POST   | `/api/workspaces/:id/members` | Add members to workspace                  |
| DELETE | `/api/workspaces/:id/members` | Remove members from workspace             |

### 📋 Board Routes

| Method | Endpoint                                       | Description                     |
| ------ | ---------------------------------------------- | ------------------------------- |
| POST   | `/api/workspaces/:workspaceId/boards`          | Create a new board in workspace |
| GET    | `/api/workspaces/:workspaceId/boards`          | Get all boards in workspace     |
| GET    | `/api/workspaces/:workspaceId/boards/:boardId` | Get specific board with tasks   |
| PUT    | `/api/workspaces/:workspaceId/boards/:boardId` | Update board details            |
| DELETE | `/api/workspaces/:workspaceId/boards/:boardId` | Delete board                    |
| GET    | `/api/boards/:boardId/analytics`               | Get board analytics data        |

### 📝 Task Routes

| Method | Endpoint                             | Description                               |
| ------ | ------------------------------------ | ----------------------------------------- |
| GET    | `/api/boards/:boardId/tasks`         | Get tasks for board (with filtering)      |
| POST   | `/api/boards/:boardId/tasks`         | Create new task in board                  |
| GET    | `/api/tasks/:taskId`                 | Get specific task with all relations      |
| PUT    | `/api/tasks/:taskId`                 | Update task details                       |
| DELETE | `/api/tasks/:taskId`                 | Delete task                               |
| PATCH  | `/api/tasks/positions`               | Batch update task positions (drag & drop) |
| GET    | `/api/users/:userId/tasks/overdue`   | Get overdue tasks for user                |
| GET    | `/api/users/:userId/tasks/analytics` | Get task analytics for user               |

## Request/Response Examples

### Authentication

**Register User**:

```bash
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login**:

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Workspaces

**Create Workspace**:

```bash
POST /api/workspaces
{
  "name": "My Project Workspace"
}
```

**Get Workspaces**:

```bash
GET /api/workspaces
# Returns list of workspaces with board/member counts
```

**Add Member to Workspace**:

```bash
POST /api/workspaces/1/members
{
  "userIds": [2, 3, 4]
}
```

### Boards

**Create Board**:

```bash
POST /api/workspaces/1/boards
{
  "title": "Sprint Planning Board"
}
```

**Get Board with Tasks**:

```bash
GET /api/workspaces/1/boards/1
# Returns board with all tasks, checklists, and comments
```

### Tasks

**Create Task**:

```bash
POST /api/boards/1/tasks
{
  "title": "Implement user authentication",
  "description": "Add login/register functionality",
  "labels": ["backend", "auth"],
  "dueDate": "2025-07-15T10:00:00Z",
  "assignedTo": 2,
  "status": "todo"
}
```

**Get Tasks with Filtering**:

```bash
GET /api/boards/1/tasks?status=todo&assignedTo=2&search=auth
# Supports filtering by status, assignee, search term, and overdue
```

**Update Task Positions (Drag & Drop)**:

```bash
PATCH /api/tasks/positions
{
  "tasks": [
    { "id": 1, "position": 0, "status": "todo" },
    { "id": 2, "position": 1, "status": "in-progress" }
  ]
}
```

**Get Task Analytics**:

```bash
GET /api/users/1/tasks/analytics?workspaceId=1
# Returns task counts by status, upcoming tasks, completion rates
```

## Query Parameters

### Task Filtering (`GET /api/boards/:boardId/tasks`)

- `status` - Filter by task status (todo, in-progress, completed)
- `assignedTo` - Filter by assigned user ID
- `search` - Search in task title and description
- `overdue` - Filter overdue tasks (true/false)

### Workspace Search (`GET /api/workspaces/search`)

- `q` - Search query for workspace names
- `page` - Page number for pagination (default: 1)
- `limit` - Results per page (default: 10)

## Response Format

All API responses follow this structure:

**Success Response**:

```json
{
  "id": 1,
  "name": "Sample Data",
  "createdAt": "2025-07-08T10:00:00Z",
  "updatedAt": "2025-07-08T10:00:00Z"
}
```

**Error Response**:

```json
{
  "error": "Error message description"
}
```

## Development Scripts

```bash
# Development
bun run dev              # Start development server with hot reload
bun run build           # Build for production
bun run start           # Start production server

# Database
bun run migrate         # Run database migrations
bun run migrate:deploy  # Deploy migrations to production
bun run db:generate     # Generate Prisma client
bun run db:push         # Push schema changes to database
bun run db:reset        # Reset database (development only)

# Code Quality
bun run lint           # Run ESLint
bun run test           # Run tests
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tasket_db"

# Server
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your-jwt-secret-key

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

## Architecture

```
src/
├── controllers/       # Request handlers
├── services/         # Business logic & optimized queries
├── routes/           # API route definitions
├── lib/              # Shared utilities (Prisma client)
├── middleware/       # Authentication & validation
└── types/            # TypeScript type definitions

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## Performance Features

- **Database Indexing**: Comprehensive indexes on all query fields
- **Query Optimization**: Efficient joins and selective loading
- **Connection Pooling**: Optimized database connections
- **Batch Operations**: Bulk updates for better performance
- **Caching Ready**: Structured for Redis integration
