import { UserRouter } from '@/api/user/router';

import express, { Express, Request, Response } from 'express';
const app: Express = express();

app.use(express.json());

app.use('/users', UserRouter);

// leaving in "hello world" for posterity
app.get('/', (_req: Request, res: Response) => {
	res.set('Content-Type', 'text/html');
	res.status(200).send('<h1>Hello World</h1>')
});

export { app };
