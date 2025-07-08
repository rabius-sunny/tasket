import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import workspacesRoutes from './routes/workspaces';
import boardsRoutes from './routes/boards';
import tasksRoutes from './routes/tasks';
import authRoutes from './routes/auth';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/health', (c) =>
  c.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// API Routes
app.route('/api/workspaces', workspacesRoutes);
app.route('/api', boardsRoutes);
app.route('/api', tasksRoutes);
app.route('/api/auth', authRoutes);

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start the server
const PORT = process.env.PORT || 3000;

console.log(`🚀 Server starting on port ${PORT}`);
console.log(`📋 Tasket API v1.0.0`);
console.log(`🌐 Health check: http://localhost:${PORT}/health`);

export default app;
