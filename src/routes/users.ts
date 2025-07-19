import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
const usersRouter = new Hono();

const userController = new UserController();

usersRouter.use(authenticate);

usersRouter.get('/invite', userController.getUsersForInvite);

export default usersRouter;
