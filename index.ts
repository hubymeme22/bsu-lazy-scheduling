import express, { Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";

import apiRoute from './routes/api';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = parseInt(process.env.PORT as string) || 8000;
const host = process.env.IP || 'localhost';

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoute);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome! this is the root for Scheduling API'
  });
});

app.listen(port, host, () => {
  console.log(`[+] Server started at: http://${host}:${port}/`);
});