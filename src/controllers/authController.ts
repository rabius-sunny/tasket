import { Context } from 'hono';
import { User } from '@prisma/client';
import prisma from '../lib/prisma';

export class AuthController {
  async register(c: Context) {
    const body = await c.req.json();

    try {
      const newUser = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          password: body.password // Consider hashing the password before saving
        }
      });
      c.status(201);
      return c.json(newUser);
    } catch (error) {
      c.status(400);
      return c.json({ error: 'User registration failed' });
    }
  }

  async login(c: Context) {
    const body = await c.req.json();
    const { email, password } = body;

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || user.password !== password) {
        // Implement proper password hashing and comparison
        c.status(401);
        return c.json({ error: 'Invalid credentials' });
      }

      // Generate a token (e.g., JWT) and send it back
      c.status(200);
      return c.json({ message: 'Login successful', user });
    } catch (error) {
      c.status(400);
      return c.json({ error: 'Login failed' });
    }
  }
}
