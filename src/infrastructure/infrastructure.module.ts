import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzleProvider } from './database/mysql/drizzle.provider';
import { UserRepository } from './repositories/user.repository';
import { PlanRepository } from './repositories/plan.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { FirebaseAuditService } from './services/firebase-audit.service';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { IPlanRepository } from '../domain/repositories/plan.repository.interface';
import { ISubscriptionRepository } from '../domain/repositories/subscription.repository.interface';
import { IAuditService } from '../domain/services/audit.service.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    drizzleProvider,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IPlanRepository,
      useClass: PlanRepository,
    },
    {
      provide: ISubscriptionRepository,
      useClass: SubscriptionRepository,
    },
    {
      provide: IAuditService,
      useClass: FirebaseAuditService,
    },
  ],
  exports: [
    IUserRepository,
    IPlanRepository,
    ISubscriptionRepository,
    IAuditService,
  ],
})
export class InfrastructureModule {}

