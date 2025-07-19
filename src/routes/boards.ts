import { Hono } from 'hono';
import { BoardController } from '../controllers/boardController';
import { authenticate } from '../middlewares/auth';

const boardsRouter = new Hono();
const boardController = new BoardController();

boardsRouter.use(authenticate);

// Create a new board
boardsRouter.post('/workspaces/:workspaceId/boards', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardData = await c.req.json();
  return boardController.createBoard(workspaceId, boardData, c);
});

// Get all boards in a workspace
boardsRouter.get('/workspaces/:workspaceId/boards', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  return boardController.getBoards(workspaceId, c);
});

// Get a specific board
boardsRouter.get('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const boardId = parseInt(c.req.param('boardId'));
  return boardController.getBoard(boardId, c);
});

boardsRouter.get('/boards/:boardId', async (c) => {
  const boardId = parseInt(c.req.param('boardId'));
  return boardController.getBoard(boardId, c);
});

// Update a board
boardsRouter.put('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardId = parseInt(c.req.param('boardId'));
  const boardData = await c.req.json();
  return boardController.updateBoard(workspaceId, boardId, boardData, c);
});

// Delete a board
boardsRouter.delete('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardId = parseInt(c.req.param('boardId'));
  return boardController.deleteBoard(workspaceId, boardId, c);
});

// Get board analytics
boardsRouter.get('/boards/:boardId/analytics', async (c) => {
  return boardController.getBoardAnalytics(c);
});

export default boardsRouter;
