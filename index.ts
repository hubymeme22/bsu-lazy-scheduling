import express, { Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import authChecker from './middlewares/auth-check';
import apiRoute from './routes/api';
import authRoute from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(authRoute);
// app.use('/api', authChecker, apiRoute);
app.use('/api', apiRoute);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome! this is the root for Scheduling API'
  });
});

app.listen(port, () => {
  console.log(`[+] Server started at: http://localhost:${port}/`);
});