import { UserRouter } from '@/api/user/router';

import express, { Express } from 'express';
const app: Express = express();

app.use(express.json())

app.use('/users', UserRouter);

export { app };
