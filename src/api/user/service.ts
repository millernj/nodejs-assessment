import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

import { User, CreateUserPayload } from './model';
import { UserRepository } from "./repository";

export const UserService = {
  // getters
  getAll: async (): Promise<ServiceResponse<User[]>> => {
    try {
      const users = await UserRepository.getAll();
      if (!users.length)
        return new ServiceResponse<User[]>(ResponseStatus.Success, StatusCodes.OK, 'No users found', users);

      return new ServiceResponse<User[]>(ResponseStatus.Success, StatusCodes.OK, `Users Found`, users);
    } catch (error) {
      const message = `Error finding users: ${(error as Error).message}`

      return new ServiceResponse(ResponseStatus.Failure, StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
  },
  findById: async (id: number): Promise<ServiceResponse<User>> => {
    try {
      const user = await UserRepository.findById(id)
      if (!user)
          return new ServiceResponse(ResponseStatus.Failure, StatusCodes.NOT_FOUND, 'User not found');

      return new ServiceResponse<User>(ResponseStatus.Success, StatusCodes.OK, `User found`, user);
    } catch (error) {
      const message = `Error finding user (id: ${id}): ${(error as Error).message}`

      return new ServiceResponse(ResponseStatus.Failure, StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
  },

  // setters
  create: async (userPayload: CreateUserPayload): Promise<ServiceResponse<User>> => {
    try {
      const user = await UserRepository.create(userPayload);
      
      return new ServiceResponse<User>(ResponseStatus.Success, StatusCodes.OK, `User Created`, user);
    } catch (error) {
      const message = `Error creating user: ${(error as Error).message}`;

      return new ServiceResponse(ResponseStatus.Failure, StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
  },
  update: async (id: number, update: Partial<CreateUserPayload>): Promise<ServiceResponse<User>> => {
    try {
      const updatedUser = await UserRepository.update(id, update);
      if (!updatedUser)
        return new ServiceResponse(ResponseStatus.Failure, StatusCodes.NOT_FOUND, 'User not found');

      return new ServiceResponse<User>(ResponseStatus.Success, StatusCodes.OK, `User Updated`, updatedUser);
    } catch (error) {
      const message = `Error updating user (id: ${id}): ${(error as Error).message}`;

      return new ServiceResponse(ResponseStatus.Failure, StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
  },
  delete: async (id: number): Promise<ServiceResponse<number>> => {
    try {
      const userId = await UserRepository.delete(id);

      return new ServiceResponse<number>(ResponseStatus.Success, StatusCodes.OK, `User (id: ${id}) deleted`, userId);
    } catch (error) {
      const message = `Error deleting user (id: ${id}): ${(error as Error).message}`;

      return new ServiceResponse(ResponseStatus.Failure, StatusCodes.INTERNAL_SERVER_ERROR, message)
    }
  },
}
