import { Prisma, User, Role } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { FindManyUsersParams, UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: (data.role as Role) ?? Role.USER,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findMany({ page, query }: FindManyUsersParams): Promise<User[]> {
    const filtered = query
      ? this.items.filter((item) => {
          const search = query.toLowerCase();
          return (
            item.name.toLowerCase().includes(search) ||
            item.email.toLowerCase().includes(search)
          );
        })
      : this.items;

    const start = (page - 1) * 20;
    const end = start + 20;

    return filtered.slice(start, end);
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex < 0) {
      throw new Error('User not found');
    }

    const current = this.items[userIndex];

    const updated: User = {
      ...current,
      name: (data.name as string | undefined) ?? current.name,
      email: (data.email as string | undefined) ?? current.email,
      password: (data.password as string | undefined) ?? current.password,
      role: (data.role as Role | undefined) ?? current.role,
      avatarUrl:
        (data.avatarUrl as string | null | undefined) ?? current.avatarUrl,
      updatedAt: new Date(),
    };

    this.items[userIndex] = updated;

    return updated;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex < 0) {
      throw new Error('User not found');
    }

    this.items.splice(userIndex, 1);
  }
}
