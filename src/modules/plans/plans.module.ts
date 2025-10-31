import { Module } from '@nestjs/common';
import { PlansController } from '../../presentation/controllers/plans.controller';
import { GetAllPlansUseCase } from '../../application/use-cases/plans/get-all-plans.use-case';

@Module({
  controllers: [PlansController],
  providers: [GetAllPlansUseCase],
})
export class PlansModule {}

