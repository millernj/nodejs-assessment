import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'fs';
import { lockSync, unlockSync } from 'lockfile';
import { User, CreateUserPayload, UpdateUserPayload } from '@/api/user/model';
import { Id } from '@/common/models/id';

const dbDir = `data`;
const dbPath = `${dbDir}/users.json`;
const dbLockPath = `${dbPath}.lock`

const loadFromFile = (): User[] => {
  // Read file if it exists
  if (existsSync(dbPath)) {
    return JSON.parse(readFileSync(dbPath, 'utf-8'));
  }

  // Ensure the directory exists
  if (!existsSync(dbDir)) mkdirSync(dbDir);

  return [];
}

// only load from file on init
const users: User[] = loadFromFile();

const saveToFile = () => {
  // lock file to ensure only one write action can be completed at any one time
  // prevents race conditions
  lockSync(dbLockPath)
  try {
    const tempPath = `${dbPath}.tmp`;
    writeFileSync(tempPath, JSON.stringify(users, null, 2) + '\n');
    renameSync(tempPath, dbPath);
  } finally {
    unlockSync(dbLockPath)
  }
}

export const UserRepository = {
  // getters
  getCount: (): number => users.length,
  getAll: async (): Promise<User[]> => users,
  findIndexById: async (userId: Id): Promise<number> => {
    const index = users.findIndex(({ id: _id }) => _id === userId);
    return index;
  },
  findById: async (userId: Id): Promise<User | null> => {
    const user = users.find(({ id: _id }) => _id === userId) || null;
    return user;
  },

  // setters
  create: async (newUser: CreateUserPayload): Promise<User> => {
    const id: Id = UserRepository.getCount() + 1;
    const user: User = { id, ...newUser };

    users.push(user);
    saveToFile();
    return user;
  },

  update: async (id: number, update: UpdateUserPayload): Promise<User | null> => {
    const index = await UserRepository.findIndexById(id);
    if (index === -1)
      return null;
    const updatedUser = { ...users[index], ...update };
    users[index] = updatedUser;
    saveToFile();
    return updatedUser;
  },

  delete: async (id: number): Promise<number> => {
    const index = await UserRepository.findIndexById(id);
    if (index === -1)
      return -1;

    users.splice(index, 1);
    saveToFile();
    return id;
  },
}
