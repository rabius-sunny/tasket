import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Context } from 'hono';
import prisma from '../lib/prisma';

export class AuthController {
  async register(c: Context) {
    const body = await c.req.json();

    try {
      // Validate required fields
      if (!body.username || !body.email || !body.password) {
        c.status(400);
        return c.json({ error: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: body.email }, { username: body.username }]
        }
      });

      if (existingUser) {
        c.status(400);
        if (existingUser.email === body.email) {
          return c.json({ error: 'Email already exists' });
        } else {
          return c.json({ error: 'Username already exists' });
        }
      }

      const newUser = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          password: body.password // Consider hashing the password before saving
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      c.status(201);
      return c.json(newUser);
    } catch (error) {
      console.error('Registration error:', error);

      // Handle Prisma unique constraint errors
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          if (target?.includes('username')) {
            c.status(400);
            return c.json({ error: 'Username already exists' });
          } else if (target?.includes('email')) {
            c.status(400);
            return c.json({ error: 'Email already exists' });
          }
        }
      }

      c.status(500);
      return c.json({ error: 'Internal server error during registration' });
    }
  }

  async login(c: Context) {
    const body = await c.req.json();
    const { email, password } = body;

    try {
      // Validate required fields
      if (!email || !password) {
        c.status(400);
        return c.json({ error: 'Email and password are required' });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          createdAt: true
        }
      });

      if (!user || user.password !== password) {
        // Implement proper password hashing and comparison
        c.status(401);
        return c.json({ error: 'Invalid email or password' });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Generate a token (e.g., JWT) and send it back
      c.status(200);
      return c.json({
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      c.status(500);
      return c.json({ error: 'Internal server error during login' });
    }
  }
}
