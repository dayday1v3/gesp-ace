import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimit.js';

const app: Express = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

app.use('/api/v1', apiRateLimiter);
app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();

    const port = parseInt(process.env.PORT || '3000', 10);
    
    app.listen(port, '0.0.0.0', () => {
      logger.info(`🚀 Server is running on http://0.0.0.0:${port}`);
      logger.info(`📚 API: http://0.0.0.0:${port}/api/v1`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
