import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { User } from '../models';
import { knex } from '../../../db/knexconfig';

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;

  constructor() {
    this.users = {}
  }

  async findOne(userId: string) {
    const user: User = await knex('users').where({ id: userId }).first();
    return user;
  }

  async findByName(name: string): Promise<User> {
    const user: User = await knex('users').where({ name }).first();
    return user;
  }

  async createOne({ name, password }: User) {
    const id = v4();
    const newUser = { id: id, name, password };

    await knex('users').insert(newUser);

    return newUser;
  }
}
