import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { IPlanRepository } from '../../domain/repositories/plan.repository.interface';
import { Plan } from '../../domain/entities/plan.entity';
import { plans } from '../database/mysql/schemas/plan.schema';
import { DRIZZLE_ORM } from '../database/mysql/drizzle.provider';
import * as schema from '../database/mysql/schemas';

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  async findAll(): Promise<Plan[]> {
    const allPlans = await this.db.select().from(plans);

    return allPlans.map(
      (plan) =>
        new Plan(
          plan.id,
          plan.name,
          plan.description,
          Number(plan.price),
          plan.durationInDays,
          plan.features as string[],
          plan.isActive,
          plan.createdAt,
        ),
    );
  }

  async findById(id: number): Promise<Plan | null> {
    const [plan] = await this.db.select().from(plans).where(eq(plans.id, id));

    if (!plan) return null;

    return new Plan(
      plan.id,
      plan.name,
      plan.description,
      Number(plan.price),
      plan.durationInDays,
      plan.features as string[],
      plan.isActive,
      plan.createdAt,
    );
  }

  async findActiveOnly(): Promise<Plan[]> {
    const activePlans = await this.db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));

    return activePlans.map(
      (plan) =>
        new Plan(
          plan.id,
          plan.name,
          plan.description,
          Number(plan.price),
          plan.durationInDays,
          plan.features as string[],
          plan.isActive,
          plan.createdAt,
        ),
    );
  }

  async create(
    name: string,
    description: string,
    price: number,
    durationInDays: number,
    features: string[],
  ): Promise<Plan> {
    const [newPlan] = await this.db
      .insert(plans)
      .values({
        name,
        description,
        price: price.toString(),
        durationInDays,
        features,
        isActive: true,
      })
      .$returningId();

    const [created] = await this.db
      .select()
      .from(plans)
      .where(eq(plans.id, newPlan.id));

    return new Plan(
      created.id,
      created.name,
      created.description,
      Number(created.price),
      created.durationInDays,
      created.features as string[],
      created.isActive,
      created.createdAt,
    );
  }
}

