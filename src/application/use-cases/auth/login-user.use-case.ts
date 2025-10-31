import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import {
  IAuditService,
  AuditEventType,
} from '../../../domain/services/audit.service.interface';

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuditService)
    private readonly auditService: IAuditService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResponse> {
    // busca el usuario por email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // verifica que la contraseña sea correcta
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // genera el token jwt
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    // registra el evento de login en firebase
    await this.auditService.log({
      eventType: AuditEventType.USER_LOGIN,
      userId: user.id,
      metadata: {
        email: user.email,
      },
      timestamp: new Date(),
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}

