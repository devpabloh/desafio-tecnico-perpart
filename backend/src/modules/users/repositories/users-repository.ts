import { Prisma, User } from '@prisma/client';

export interface FindManyUsersParams {
  page: number;
  query?: string;
}

export abstract class UsersRepository {
  abstract create(data: Prisma.UserCreateInput): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findMany(params: FindManyUsersParams): Promise<User[]>;
  abstract update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
