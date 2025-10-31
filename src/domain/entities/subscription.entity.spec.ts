import { Subscription, SubscriptionStatus } from './subscription.entity';

describe('Subscription Entity', () => {
  it('should be defined', () => {
    const subscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      new Date(),
      new Date(),
      new Date(),
    );

    expect(subscription).toBeDefined();
  });

  it('should correctly identify active subscription', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const subscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      futureDate,
      new Date(),
      new Date(),
    );

    expect(subscription.isActive()).toBe(true);
  });

  it('should correctly identify expired subscription', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const subscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      pastDate,
      new Date(),
      new Date(),
    );

    expect(subscription.hasExpired()).toBe(true);
  });

  it('should cancel subscription', () => {
    const subscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      new Date(),
      new Date(),
      new Date(),
    );

    const cancelled = subscription.cancel();

    expect(cancelled.status).toBe(SubscriptionStatus.CANCELLED);
  });

  it('should update status to expired if past end date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const subscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      pastDate,
      new Date(),
      new Date(),
    );

    const updated = subscription.checkAndUpdateStatus();

    expect(updated.status).toBe(SubscriptionStatus.EXPIRED);
  });
});

