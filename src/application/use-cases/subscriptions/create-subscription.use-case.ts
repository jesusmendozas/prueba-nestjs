import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IPlanRepository } from '../../../domain/repositories/plan.repository.interface';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import {
  IAuditService,
  AuditEventType,
} from '../../../domain/services/audit.service.interface';
import { Subscription } from '../../../domain/entities/subscription.entity';

export interface CreateSubscriptionDto {
  userId: number;
  planId: number;
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPlanRepository)
    private readonly planRepository: IPlanRepository,
    @Inject(ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(IAuditService)
    private readonly auditService: IAuditService,
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    // verifica que el usuario exista
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // verifica que el plan exista y esté activo
    const plan = await this.planRepository.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }
    if (!plan.isAvailable()) {
      throw new BadRequestException('Este plan no está disponible');
    }

    // verifica si el usuario ya tiene una suscripción activa
    const existingSubscription =
      await this.subscriptionRepository.findActiveByUserId(dto.userId);
    if (existingSubscription && existingSubscription.isActive()) {
      throw new BadRequestException(
        'El usuario ya tiene una suscripción activa',
      );
    }

    // calcula las fechas de inicio y fin
    const startDate = new Date();
    const endDate = plan.calculateEndDate(startDate);

    // crea la suscripción
    const subscription = await this.subscriptionRepository.create(
      dto.userId,
      dto.planId,
      startDate,
      endDate,
    );

    // registra el evento en firebase
    await this.auditService.log({
      eventType: AuditEventType.SUBSCRIPTION_CREATED,
      userId: dto.userId,
      metadata: {
        subscriptionId: subscription.id,
        planId: dto.planId,
        planName: plan.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      timestamp: new Date(),
    });

    return subscription;
  }
}

