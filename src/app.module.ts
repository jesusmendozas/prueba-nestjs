import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InfrastructureModule,
    AuthModule,
    PlansModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
