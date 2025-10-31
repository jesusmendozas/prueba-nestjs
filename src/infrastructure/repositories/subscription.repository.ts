import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { ISubscriptionRepository } from '../../domain/repositories/subscription.repository.interface';
import {
  Subscription,
  SubscriptionStatus,
} from '../../domain/entities/subscription.entity';
import { subscriptions } from '../database/mysql/schemas/subscription.schema';
import { DRIZZLE_ORM } from '../database/mysql/drizzle.provider';
import * as schema from '../database/mysql/schemas';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  async create(
    userId: number,
    planId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Subscription> {
    const [newSubscription] = await this.db
      .insert(subscriptions)
      .values({
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
      })
      .$returningId();

    const [created] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, newSubscription.id));

    return new Subscription(
      created.id,
      created.userId,
      created.planId,
      created.status as SubscriptionStatus,
      created.startDate,
      created.endDate,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    const userSubscriptions = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    return userSubscriptions.map(
      (sub) =>
        new Subscription(
          sub.id,
          sub.userId,
          sub.planId,
          sub.status as SubscriptionStatus,
          sub.startDate,
          sub.endDate,
          sub.createdAt,
          sub.updatedAt,
        ),
    );
  }

  async findActiveByUserId(userId: number): Promise<Subscription | null> {
    const [activeSub] = await this.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, SubscriptionStatus.ACTIVE),
        ),
      );

    if (!activeSub) return null;

    return new Subscription(
      activeSub.id,
      activeSub.userId,
      activeSub.planId,
      activeSub.status as SubscriptionStatus,
      activeSub.startDate,
      activeSub.endDate,
      activeSub.createdAt,
      activeSub.updatedAt,
    );
  }

  async findById(id: number): Promise<Subscription | null> {
    const [subscription] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));

    if (!subscription) return null;

    return new Subscription(
      subscription.id,
      subscription.userId,
      subscription.planId,
      subscription.status as SubscriptionStatus,
      subscription.startDate,
      subscription.endDate,
      subscription.createdAt,
      subscription.updatedAt,
    );
  }

  async updateStatus(
    id: number,
    status: SubscriptionStatus,
  ): Promise<Subscription> {
    await this.db
      .update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.id, id));

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Suscripción no encontrada después de la actualización');
    }
    return updated;
  }

  async cancel(id: number): Promise<Subscription> {
    return this.updateStatus(id, SubscriptionStatus.CANCELLED);
  }
}

