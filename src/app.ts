import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import sequelizeDb from './db/database';
import userRouter from './routers/users/users';

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://movie-frontend-git-main-ankitas-projects-f5c00b6c.vercel.app',
    'http://localhost:3000', 
    'https://movie-frontend-tau-five.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// API routes
app.use('/api', userRouter);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = Number(process.env.PORT || 5000);

const connectDB = async () => {
  try {
    await sequelizeDb.authenticate();
    console.log('Database connection established');
    await sequelizeDb.sync({ force: false });
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Vercel requires module.exports for serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Local development
  (async () => {
    const dbConnected = await connectDB();
    if (dbConnected) {
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error('Failed to start server due to database connection issues');
    }
  })();
}