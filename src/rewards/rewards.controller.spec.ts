import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from '../rewards/rewards.controller';
import { RewardsService } from '../rewards/rewards.service';

describe('RewardsController', () => {
  let controller: RewardsController;
  let service: RewardsService;

  const mockRewardsService = {
    getUserPoints: jest.fn(),
    getTransactions: jest.fn(),
    redeemPoints: jest.fn(),
    getRewardOptions: jest.fn(),
    createTransaction: jest.fn(),
    seedMockData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [
        {
          provide: RewardsService,
          useValue: mockRewardsService,
        },
      ],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
    service = module.get<RewardsService>(RewardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPoints', () => {
    it('should return user points', async () => {
      const userId = 'user_1';
      const expectedResult = { userId, totalPoints: 150 };
      mockRewardsService.getUserPoints.mockResolvedValue(expectedResult);

      const result = await controller.getPoints(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getUserPoints).toHaveBeenCalledWith(userId);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions with pagination', async () => {
      const query = { userId: 'user_1', page: 1, limit: 5 };
      const expectedResult = {
        transactions: [],
        pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
      };
      mockRewardsService.getTransactions.mockResolvedValue(expectedResult);

      const result = await controller.getTransactions(query);

      expect(result).toEqual(expectedResult);
      expect(service.getTransactions).toHaveBeenCalledWith(query);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const redeemData = {
        userId: 'user_1',
        pointsToRedeem: 100,
        rewardType: 'cashback',
      };
      const expectedResult = {
        success: true,
        message: 'Points redeemed successfully',
        remainingPoints: 50,
      };
      mockRewardsService.redeemPoints.mockResolvedValue(expectedResult);

      const result = await controller.redeemPoints(redeemData);

      expect(result).toEqual(expectedResult);
      expect(service.redeemPoints).toHaveBeenCalledWith(redeemData);
    });
  });

  describe('getRewardOptions', () => {
    it('should return available reward options', async () => {
      const expectedResult = [
        { type: 'cashback', name: 'Cashback', pointsRequired: 100, description: '₹10 cashback' },
      ];
      mockRewardsService.getRewardOptions.mockResolvedValue(expectedResult);

      const result = await controller.getRewardOptions();

      expect(result).toEqual(expectedResult);
      expect(service.getRewardOptions).toHaveBeenCalled();
    });
  });
});
