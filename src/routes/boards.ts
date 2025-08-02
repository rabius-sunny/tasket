import { Hono } from 'hono';
import { BoardController } from '../controllers/boardController';
import { authenticate } from '../middlewares/auth';

const boardsRouter = new Hono();
const boardController = new BoardController();

boardsRouter.use(authenticate);

// Create a new board
boardsRouter.post('/', async (c) => {
  return boardController.createBoard(c);
});

// Get all boards in a workspace
boardsRouter.get('/', async (c) => {
  return boardController.getBoards(c);
});

// Update a board
boardsRouter.put('/', async (c) => {
  return boardController.updateBoard(c);
});

// Delete a board
boardsRouter.delete('/', async (c) => {
  return boardController.deleteBoard(c);
});

// Get board analytics
boardsRouter.get('/analytics', async (c) => {
  return boardController.getBoardAnalytics(c);
});

export default boardsRouter;
