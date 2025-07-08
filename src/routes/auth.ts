import { Hono } from 'hono';
import { AuthController } from '../controllers/authController';

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;
