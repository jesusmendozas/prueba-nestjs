import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Dirección de email del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

