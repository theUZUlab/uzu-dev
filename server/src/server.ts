import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env, corsOptions } from './config/env';
import healthRouter from './routes/health.route';
import postsRouter from './routes/posts.route';

export function createServer() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use('/health', healthRouter);
  app.use('/api/posts', postsRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}
