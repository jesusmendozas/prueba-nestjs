import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription.repository.interface';
import { Subscription } from '../../../domain/entities/subscription.entity';

@Injectable()
export class GetUserSubscriptionUseCase {
  constructor(
    @Inject(ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: number): Promise<Subscription[]> {
    const subscriptions =
      await this.subscriptionRepository.findByUserId(userId);

    if (!subscriptions || subscriptions.length === 0) {
      throw new NotFoundException('No se encontraron suscripciones para este usuario');
    }

    // verifica y actualiza el estado de las suscripciones expiradas
    const updatedSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        const updatedSub = subscription.checkAndUpdateStatus();
        if (updatedSub.status !== subscription.status) {
          return await this.subscriptionRepository.updateStatus(
            updatedSub.id,
            updatedSub.status,
          );
        }
        return subscription;
      }),
    );

    return updatedSubscriptions;
  }
}

