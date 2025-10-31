import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(email: string, hashedPassword: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export const IUserRepository = Symbol('IUserRepository');

