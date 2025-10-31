import { Subscription, SubscriptionStatus } from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  create(
    userId: number,
    planId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Subscription>;
  findByUserId(userId: number): Promise<Subscription[]>;
  findActiveByUserId(userId: number): Promise<Subscription | null>;
  findById(id: number): Promise<Subscription | null>;
  updateStatus(id: number, status: SubscriptionStatus): Promise<Subscription>;
  cancel(id: number): Promise<Subscription>;
}

export const ISubscriptionRepository = Symbol('ISubscriptionRepository');

