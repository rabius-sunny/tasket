import { Hono } from 'hono';
import { BoardController } from '../controllers/boardController';
import { authenticate } from '../middlewares/auth';

const boardsRouter = new Hono();
const boardController = new BoardController();

boardsRouter.use(authenticate);

// Create a new board
boardsRouter.post('/', async (c) => {
  const boardData = await c.req.json();
  return boardController.createBoard(boardData, c);
});

// Get all boards in a workspace
boardsRouter.get('/', async (c) => {
  const boardId = Number(c.req.query('id'));
  const workspaceId = Number(c.req.query('workspaceId'));
  return boardController.getBoards({ c, boardId, workspaceId });
});

// Update a board
boardsRouter.put('/', async (c) => {
  const boardData = await c.req.json();
  return boardController.updateBoard(boardData, c);
});

// Delete a board
boardsRouter.delete('/', async (c) => {
  const boardId = Number(c.req.query('boardId'));
  return boardController.deleteBoard(boardId, c);
});

// Get board analytics
boardsRouter.get('/analytics', async (c) => {
  return boardController.getBoardAnalytics(c);
});

export default boardsRouter;
