import { DataOpResponse } from '@/common/models/dataOpResponse';

import { User, UserPayload } from './model';
import { UserRepository } from "./repository";

export const UserService = {
  // getters
  getAll: async (): Promise<User[]> => UserRepository.getAll(),
  findById: async (id: number): Promise<User | null> => UserRepository.findById(id),

  // setters
  create: async (newUser: UserPayload): Promise<DataOpResponse> => {
    const id: number = UserRepository.getCount() + 1;
    const user: User = { id, ...newUser };

    return UserRepository.create(user);
  },
  update: async (id: number, update: Partial<UserPayload>): Promise<DataOpResponse> => UserRepository.update(id, update),
  delete: async (id: number): Promise<DataOpResponse> => UserRepository.delete(id),
}
