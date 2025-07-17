import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
const usersRouter = new Hono();

const userController = new UserController();

usersRouter.get('/invite', userController.getUsersForInvite);

export default usersRouter;
