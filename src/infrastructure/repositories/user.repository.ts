import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { users } from '../database/mysql/schemas/user.schema';
import { DRIZZLE_ORM } from '../database/mysql/drizzle.provider';
import * as schema from '../database/mysql/schemas';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  async create(email: string, hashedPassword: string): Promise<User> {
    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .$returningId();

    const [created] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, newUser.id));

    return new User(
      created.id,
      created.email,
      created.password,
      created.createdAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.createdAt);
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.createdAt);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.db.select().from(users);

    return allUsers.map(
      (user) => new User(user.id, user.email, user.password, user.createdAt),
    );
  }
}

