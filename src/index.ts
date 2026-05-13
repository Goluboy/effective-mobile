import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from './utils/jwt';
import { config } from './config';
import { connectDB } from './config/database';
import userRoutes from './routes/users';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

startServer();

export default app;
