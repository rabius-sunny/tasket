import { Hono } from 'hono';
import { BoardController } from '../controllers/boardController';

const boards = new Hono();
const boardController = new BoardController();

// Create a new board
boards.post('/workspaces/:workspaceId/boards', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardData = await c.req.json();
  return boardController.createBoard(workspaceId, boardData, c);
});

// Get all boards in a workspace
boards.get('/workspaces/:workspaceId/boards', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  return boardController.getBoards(workspaceId, c);
});

// Get a specific board
boards.get('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardId = parseInt(c.req.param('boardId'));
  return boardController.getBoard(workspaceId, boardId, c);
});

// Update a board
boards.put('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardId = parseInt(c.req.param('boardId'));
  const boardData = await c.req.json();
  return boardController.updateBoard(workspaceId, boardId, boardData, c);
});

// Delete a board
boards.delete('/workspaces/:workspaceId/boards/:boardId', async (c) => {
  const workspaceId = parseInt(c.req.param('workspaceId'));
  const boardId = parseInt(c.req.param('boardId'));
  return boardController.deleteBoard(workspaceId, boardId, c);
});

// Get board analytics
boards.get('/boards/:boardId/analytics', async (c) => {
  return boardController.getBoardAnalytics(c);
});

export default boards;
