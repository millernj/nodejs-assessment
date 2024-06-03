import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { DataOpResponse } from '@/common/models/dataOpResponse';
import { User, UserPayload } from '@/api/user/model';

const dbDir = `data`;
const dbPath = `data/users.json`;

const loadFromFile = (): User[] => {
  // Read file if it exists
  if (existsSync(dbPath)) {
    return JSON.parse(readFileSync(dbPath, 'utf-8'));
  }

  // Ensure the directory exists
  if (!existsSync(dbDir)) mkdirSync(dbDir);

  return [];
}

let users: User[] = loadFromFile();

const saveToFile = () => writeFileSync(dbPath, JSON.stringify(users, null, 2));

export const UserRepository = {
  // getters
  getCount: (): number => users.length,
  getAll: async (): Promise<User[]> => Promise.resolve(users),
  findIndexById: async (userId: number): Promise<number> => {
    const index = users.findIndex(({ id: _id }) => _id === userId);
    return Promise.resolve(index)
  },
  findById: async (userId: number): Promise<User | undefined> => {
    const user = users.find(({ id: _id }) => _id === userId);
    return Promise.resolve(user)
  },

  // setters
  create: async (newUser: User): Promise<DataOpResponse> => {
    users.push(newUser);
    saveToFile();
    return Promise.resolve({ success: true, message: `1 user added: ${JSON.stringify(newUser)}`})
  },

  update: async (id: number, update: Partial<UserPayload>): Promise<DataOpResponse> => {
    const index = await UserRepository.findIndexById(id);
    if (index === -1)
      return Promise.resolve({ success: false, message: `User with id ${id} not found` })

    const updatedUser = { ...users[index], ...update };
    users[index] = updatedUser;
    saveToFile();
    return Promise.resolve({ success: true, message: `User ${id} updated : ${JSON.stringify(updatedUser)}`})
  },

  delete: async (id: number): Promise<DataOpResponse> => {
    const index = await UserRepository.findIndexById(id);
    if (index === -1)
      return Promise.resolve({ success: false, message: `User with id ${id} not found` })

    users.splice(index, 1);
    saveToFile();
    return Promise.resolve({ success: true, message: `User ${id} deleted`})
  },
}
