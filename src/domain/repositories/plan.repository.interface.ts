import { Plan } from '../entities/plan.entity';

export interface IPlanRepository {
  findAll(): Promise<Plan[]>;
  findById(id: number): Promise<Plan | null>;
  findActiveOnly(): Promise<Plan[]>;
  create(
    name: string,
    description: string,
    price: number,
    durationInDays: number,
    features: string[],
  ): Promise<Plan>;
}

export const IPlanRepository = Symbol('IPlanRepository');

