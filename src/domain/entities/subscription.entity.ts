export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export class Subscription {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly planId: number,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public isActive(): boolean {
    return (
      this.status === SubscriptionStatus.ACTIVE &&
      new Date() <= this.endDate
    );
  }

  public hasExpired(): boolean {
    return new Date() > this.endDate;
  }

  public cancel(): Subscription {
    return new Subscription(
      this.id,
      this.userId,
      this.planId,
      SubscriptionStatus.CANCELLED,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date(),
    );
  }

  public checkAndUpdateStatus(): Subscription {
    if (this.hasExpired() && this.status === SubscriptionStatus.ACTIVE) {
      return new Subscription(
        this.id,
        this.userId,
        this.planId,
        SubscriptionStatus.EXPIRED,
        this.startDate,
        this.endDate,
        this.createdAt,
        new Date(),
      );
    }
    return this;
  }
}

