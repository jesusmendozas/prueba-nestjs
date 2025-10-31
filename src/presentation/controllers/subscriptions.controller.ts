import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateSubscriptionUseCase } from '../../application/use-cases/subscriptions/create-subscription.use-case';
import { GetUserSubscriptionUseCase } from '../../application/use-cases/subscriptions/get-user-subscription.use-case';
import { CreateSubscriptionDto } from '../dtos/subscriptions/create-subscription.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly getUserSubscriptionUseCase: GetUserSubscriptionUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva suscripción (pago simulado)' })
  @ApiResponse({
    status: 201,
    description: 'Suscripción creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya tiene una suscripción activa o el plan no está disponible',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async createSubscription(
    @CurrentUser() user: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const subscription = await this.createSubscriptionUseCase.execute({
      userId: user.sub,
      planId: createSubscriptionDto.planId,
    });

    return {
      message: 'Suscripción creada exitosamente',
      subscription,
    };
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el estado de suscripción del usuario' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la suscripción del usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron suscripciones',
  })
  async getUserSubscription(@Param('userId', ParseIntPipe) userId: number) {
    const subscriptions =
      await this.getUserSubscriptionUseCase.execute(userId);

    return {
      userId,
      subscriptions,
    };
  }
}

