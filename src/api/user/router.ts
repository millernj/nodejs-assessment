import express, { Request, Response, NextFunction, Router } from 'express';

import { handleServiceResponse, validateBody, validateParams } from '@/common/utils/httpHandlers';
import { UserService } from './service';
import { CreateUserPayload, UserParamSchema, CreateUserSchema, UpdateUserSchema } from './model';


export const UserRouter: Router = (() => {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    const users = await UserService.getAll();
    res.json(users);
  });

  router.get('/:id', validateParams(UserParamSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const serviceResponse = await UserService.findById(id);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', validateBody(CreateUserSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body as CreateUserPayload;
      const serviceResponse = await UserService.create(newUser);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', validateParams(UserParamSchema), validateBody(UpdateUserSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const userUpdate = req.body as Partial<CreateUserPayload>;
      const serviceResponse = await UserService.update(id, userUpdate);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', validateParams(UserParamSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const serviceResponse = await UserService.delete(id);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      next(error);
    }
  });

  return router;
})()
