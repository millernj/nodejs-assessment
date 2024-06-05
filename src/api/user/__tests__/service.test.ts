import { StatusCodes } from 'http-status-codes';
import { UserService } from '@/api/user/service';
import { UserRepository } from '@/api/user/repository';
import { User, CreateUserPayload, UpdateUserPayload } from '@/api/user/model';

jest.mock('@/api/user/repository');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fakeUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
  };

  describe('getAll', () => {
    it('should return users if found', async () => {
      const users: User[] = [fakeUser];
      (UserRepository.getAll as jest.Mock).mockResolvedValue(users);

      const result = await UserService.getAll();

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toEqual(users);
    });

    it('should return no users found if the list is empty', async () => {
      (UserRepository.getAll as jest.Mock).mockResolvedValue([]);

      const result = await UserService.getAll();

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toEqual([]);
    });

    it('should return an error if the repository throws an error', async () => {
      const errorMessage = 'Database error';
      (UserRepository.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await UserService.getAll();

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return the user if found', async () => {
      const user: User = fakeUser;
      (UserRepository.findById as jest.Mock).mockResolvedValue(user);

      const result = await UserService.findById(1);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toEqual(user);
    });

    it('should return user not found if the user does not exist', async () => {
      (UserRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await UserService.findById(1);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toBeUndefined();
    });

    it('should return an error if the repository throws an error', async () => {
      const errorMessage = 'Database error';
      (UserRepository.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await UserService.findById(1);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userPayload: CreateUserPayload = fakeUser;
      const user: User = { id: 1, ...userPayload };
      (UserRepository.create as jest.Mock).mockResolvedValue(user);

      const result = await UserService.create(userPayload);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy();
      expect(result.responseObject).toEqual(user);
    });

    it('should return an error if the repository throws an error', async () => {
      const userPayload: CreateUserPayload = fakeUser;
      const errorMessage = 'Database error';
      (UserRepository.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await UserService.create(userPayload);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update the user if found', async () => {
      const updatePayload: UpdateUserPayload = { name: fakeUser.name };
      const updatedUser: User = fakeUser;
      (UserRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await UserService.update(fakeUser.id, updatePayload);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy();
      expect(result.responseObject).toEqual(updatedUser);
    });

    it('should return user not found if the user does not exist', async () => {
      (UserRepository.update as jest.Mock).mockResolvedValue(null);

      const result = await UserService.update(fakeUser.id, { name: fakeUser.name });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toBeUndefined();
    });

    it('should return an error if the repository throws an error', async () => {
      const updatePayload: UpdateUserPayload = { name: fakeUser.name };
      const errorMessage = 'Database error';
      (UserRepository.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await UserService.update(fakeUser.id, updatePayload);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete the user if found', async () => {
      (UserRepository.delete as jest.Mock).mockResolvedValue(fakeUser.id);

      const result = await UserService.delete(fakeUser.id);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBeTruthy();
      expect(result.responseObject).toEqual(fakeUser.id);
    });

    it('should return user not found if the user does not exist', async () => {
      (UserRepository.delete as jest.Mock).mockResolvedValue(-1);

      const result = await UserService.delete(fakeUser.id);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.message).toBeTruthy()
      expect(result.responseObject).toBeUndefined();
    });

    it('should return an error if the repository throws an error', async () => {
      const errorMessage = 'Database error';
      (UserRepository.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await UserService.delete(fakeUser.id);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeUndefined();
    });
  });
});
