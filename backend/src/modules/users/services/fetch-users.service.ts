import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface FetchUsersRequest {
  page?: number;
  query?: string;
}

@Injectable()
export class FetchUsersService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ page, query }: FetchUsersRequest) {
    const users = await this.usersRepository.findMany({
      page: page ?? 1,
      query,
    });

    return { users };
  }
}
