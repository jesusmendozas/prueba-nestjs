import { Module } from '@nestjs/common';
import { SubscriptionsController } from '../../presentation/controllers/subscriptions.controller';
import { CreateSubscriptionUseCase } from '../../application/use-cases/subscriptions/create-subscription.use-case';
import { GetUserSubscriptionUseCase } from '../../application/use-cases/subscriptions/get-user-subscription.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubscriptionsController],
  providers: [CreateSubscriptionUseCase, GetUserSubscriptionUseCase],
})
export class SubscriptionsModule {}

