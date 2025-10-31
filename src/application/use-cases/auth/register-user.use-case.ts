import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import {
  IAuditService,
  AuditEventType,
} from '../../../domain/services/audit.service.interface';
import { User } from '../../../domain/entities/user.entity';

export interface RegisterUserDto {
  email: string;
  password: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuditService)
    private readonly auditService: IAuditService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    // verifica si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este email');
    }

    // hashea la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // crea el nuevo usuario
    const user = await this.userRepository.create(dto.email, hashedPassword);

    // registra el evento de registro en firebase
    await this.auditService.log({
      eventType: AuditEventType.USER_REGISTERED,
      userId: user.id,
      metadata: {
        email: user.email,
      },
      timestamp: new Date(),
    });

    return user;
  }
}

