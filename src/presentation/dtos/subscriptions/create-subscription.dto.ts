import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 1,
    description: 'ID del plan al que se quiere suscribir',
  })
  @IsNumber()
  @IsPositive()
  planId: number;
}

