import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from './register-user.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditService } from '../../../domain/services/audit.service.interface';
import { User } from '../../../domain/entities/user.entity';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let auditService: jest.Mocked<IAuditService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockAuditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: IAuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    userRepository = module.get(IUserRepository);
    auditService = module.get(IAuditService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = new User(
      1,
      dto.email,
      'hashed_password',
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);
    auditService.log.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepository.create).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
    );
    expect(auditService.log).toHaveBeenCalled();
  });

  it('should throw ConflictException if user already exists', async () => {
    const dto = {
      email: 'existing@example.com',
      password: 'password123',
    };

    const existingUser = new User(
      1,
      dto.email,
      'hashed_password',
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

