import express from 'express';
import cors from 'cors';
import authRoutes from '@modules/auth/auth.routes';
import { errorHandler } from '@core/middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use('/health', (req, res) => {
  res.status(200).send('OK');
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
