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
boardsRouter.get('/', async (c) => {
  const boardId = Number(c.req.query('id'));
  const workspaceId = Number(c.req.query('workspaceId'));
  return boardController.getBoards({ c, boardId, workspaceId });
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
