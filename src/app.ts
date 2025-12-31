import express from 'express';
import cors from 'cors';
import authRoutes from '@modules/auth/auth.routes';
import { errorHandler } from '@core/middlewares/error.middleware';
import config from '@core/config/app.config';

const app = express();

const isAllowedOrigin = (origin: string): boolean => {
  const trimmed = origin.trim();
  if (!trimmed) return false;

  if (config.corsOrigins.includes(trimmed)) return true;

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.toLowerCase();
    const baseDomain = config.baseDomain.toLowerCase();
    const isSubdomain = hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);

    if (isSubdomain) return true;
    if (config.nodeEnv !== 'production' && ['localhost', '127.0.0.1'].includes(hostname)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, isAllowedOrigin(origin));
    },
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
