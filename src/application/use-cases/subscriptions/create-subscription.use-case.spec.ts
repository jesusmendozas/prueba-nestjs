import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSubscriptionUseCase } from './create-subscription.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPlanRepository } from '../../../domain/repositories/plan.repository.interface';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription.repository.interface';
import { IAuditService } from '../../../domain/services/audit.service.interface';
import { User } from '../../../domain/entities/user.entity';
import { Plan } from '../../../domain/entities/plan.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../../../domain/entities/subscription.entity';

describe('CreateSubscriptionUseCase', () => {
  let useCase: CreateSubscriptionUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let planRepository: jest.Mocked<IPlanRepository>;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let auditService: jest.Mocked<IAuditService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
    };

    const mockPlanRepository = {
      findById: jest.fn(),
    };

    const mockSubscriptionRepository = {
      findActiveByUserId: jest.fn(),
      create: jest.fn(),
    };

    const mockAuditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSubscriptionUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: IPlanRepository,
          useValue: mockPlanRepository,
        },
        {
          provide: ISubscriptionRepository,
          useValue: mockSubscriptionRepository,
        },
        {
          provide: IAuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    useCase = module.get<CreateSubscriptionUseCase>(CreateSubscriptionUseCase);
    userRepository = module.get(IUserRepository);
    planRepository = module.get(IPlanRepository);
    subscriptionRepository = module.get(ISubscriptionRepository);
    auditService = module.get(IAuditService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a subscription successfully', async () => {
    const dto = {
      userId: 1,
      planId: 1,
    };

    const mockUser = new User(1, 'test@example.com', 'hashed', new Date());
    const mockPlan = new Plan(
      1,
      'Basic',
      'Description',
      9.99,
      30,
      ['feature1'],
      true,
      new Date(),
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const mockSubscription = new Subscription(
      1,
      dto.userId,
      dto.planId,
      SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      new Date(),
      new Date(),
    );

    userRepository.findById.mockResolvedValue(mockUser);
    planRepository.findById.mockResolvedValue(mockPlan);
    subscriptionRepository.findActiveByUserId.mockResolvedValue(null);
    subscriptionRepository.create.mockResolvedValue(mockSubscription);
    auditService.log.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockSubscription);
    expect(userRepository.findById).toHaveBeenCalledWith(dto.userId);
    expect(planRepository.findById).toHaveBeenCalledWith(dto.planId);
    expect(subscriptionRepository.create).toHaveBeenCalled();
    expect(auditService.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found', async () => {
    const dto = {
      userId: 999,
      planId: 1,
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if user has active subscription', async () => {
    const dto = {
      userId: 1,
      planId: 1,
    };

    const mockUser = new User(1, 'test@example.com', 'hashed', new Date());
    const mockPlan = new Plan(
      1,
      'Basic',
      'Description',
      9.99,
      30,
      ['feature1'],
      true,
      new Date(),
    );

    const existingSubscription = new Subscription(
      1,
      1,
      1,
      SubscriptionStatus.ACTIVE,
      new Date(),
      new Date(Date.now() + 86400000),
      new Date(),
      new Date(),
    );

    userRepository.findById.mockResolvedValue(mockUser);
    planRepository.findById.mockResolvedValue(mockPlan);
    subscriptionRepository.findActiveByUserId.mockResolvedValue(
      existingSubscription,
    );

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });
});

