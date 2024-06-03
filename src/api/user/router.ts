import express, { Request, Response, NextFunction, Router } from 'express';
import { UserService } from './service';
import { UserPayload } from './model';


export const UserRouter: Router = (() => {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    const users = await UserService.getAll();
    res.json(users);
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const user = await UserService.findById(id);
      if (!user) {
        res.status(404);
        throw new Error(`User with Id ${id} not found`)
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body as UserPayload;
      if (!newUser) {
        res.status(400);
        throw new Error('Bad Payload');
      }
      const response = await UserService.create(newUser);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (!id) { 
        res.status(400);
        throw new Error('Missing User Id');
      }
      const userUpdate = req.body as Partial<UserPayload>;
      if (!userUpdate) {
        res.status(400);
        throw new Error('Bad payload');
      }

      const response = await UserService.update(id, userUpdate);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (!id) {
        res.status(400);
        throw new Error('Missing User Id');
      }
      const response = await UserService.delete(id);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
})()
