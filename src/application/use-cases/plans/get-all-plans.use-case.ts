import { Injectable, Inject } from '@nestjs/common';
import { IPlanRepository } from '../../../domain/repositories/plan.repository.interface';
import { Plan } from '../../../domain/entities/plan.entity';

@Injectable()
export class GetAllPlansUseCase {
  constructor(
    @Inject(IPlanRepository)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(activeOnly: boolean = false): Promise<Plan[]> {
    if (activeOnly) {
      return await this.planRepository.findActiveOnly();
    }
    return await this.planRepository.findAll();
  }
}

