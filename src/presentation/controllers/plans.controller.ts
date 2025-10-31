import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetAllPlansUseCase } from '../../application/use-cases/plans/get-all-plans.use-case';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly getAllPlansUseCase: GetAllPlansUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes disponibles' })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Filtrar solo planes activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes',
  })
  async getPlans(@Query('activeOnly') activeOnly?: string) {
    const onlyActive = activeOnly === 'true';
    const plans = await this.getAllPlansUseCase.execute(onlyActive);
    return {
      count: plans.length,
      plans,
    };
  }
}

