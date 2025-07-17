import { MiddlewareHandler } from 'hono';
import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const payload = await verify(token, JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (e) {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }
};

export const generateJwtToken = async (payload: {}): Promise<string> => {
  return await sign(payload, JWT_SECRET);
};
