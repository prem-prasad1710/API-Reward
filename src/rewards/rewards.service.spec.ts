import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { User } from '../schemas/user.schema';
import { Reward } from '../schemas/reward.schema';
import { Transaction } from '../schemas/transaction.schema';
import { Redemption } from '../schemas/redemption.schema';

describe('RewardsService', () => {
  let service: RewardsService;
  let mockUserModel: any;
  let mockRewardModel: any;
  let mockTransactionModel: any;
  let mockRedemptionModel: any;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      insertMany: jest.fn(),
    };

    mockRewardModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      create: jest.fn(),
    };

    // Create a constructor function for Transaction
    mockTransactionModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: 'transaction_id' }),
    }));
    
    // Add methods to the constructor function
    mockTransactionModel.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    mockTransactionModel.countDocuments = jest.fn();
    mockTransactionModel.create = jest.fn();
    mockTransactionModel.aggregate = jest.fn();

    // Create a constructor function for Redemption
    mockRedemptionModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: 'redemption_id' }),
    }));
    
    // Add the aggregate method to the constructor function
    mockRedemptionModel.aggregate = jest.fn();

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Reward.name),
          useValue: mockRewardModel,
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
        {
          provide: getModelToken(Redemption.name),
          useValue: mockRedemptionModel,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPoints', () => {
    it('should return user points from cache if available', async () => {
      const userId = 'user_1';
      const cachedData = { userId, totalPoints: 150 };
      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getUserPoints(userId);

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalledWith(`user_points_${userId}`);
    });

    it('should fetch user points from database and cache it', async () => {
      const userId = 'user_1';
      mockCacheManager.get.mockResolvedValue(null);
      mockRewardModel.findOne.mockResolvedValue({ userId, totalPoints: 200 });

      const result = await service.getUserPoints(userId);

      expect(result).toEqual({ userId, totalPoints: 200 });
      expect(mockRewardModel.findOne).toHaveBeenCalledWith({ userId });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user rewards not found', async () => {
      const userId = 'user_1';
      mockCacheManager.get.mockResolvedValue(null);
      mockRewardModel.findOne.mockResolvedValue(null);

      await expect(service.getUserPoints(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeemPoints', () => {
    it('should successfully redeem points', async () => {
      const redeemData = {
        userId: 'user_1',
        pointsToRedeem: 100,
        rewardType: 'cashback',
      };

      const userReward = {
        totalPoints: 200,
        save: jest.fn().mockResolvedValue({}),
      };

      mockRewardModel.findOne.mockResolvedValue(userReward);

      const result = await service.redeemPoints(redeemData);

      expect(result.success).toBe(true);
      expect(result.remainingPoints).toBe(100);
      expect(userReward.totalPoints).toBe(100);
      expect(userReward.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for insufficient points', async () => {
      const redeemData = {
        userId: 'user_1',
        pointsToRedeem: 300,
        rewardType: 'cashback',
      };

      const userReward = { totalPoints: 200 };
      mockRewardModel.findOne.mockResolvedValue(userReward);

      await expect(service.redeemPoints(redeemData)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user rewards not found', async () => {
      const redeemData = {
        userId: 'user_1',
        pointsToRedeem: 100,
        rewardType: 'cashback',
      };

      mockRewardModel.findOne.mockResolvedValue(null);

      await expect(service.redeemPoints(redeemData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRewardOptions', () => {
    it('should return cached reward options if available', async () => {
      const cachedOptions = [
        { type: 'cashback', name: 'Cashback', pointsRequired: 100, description: '₹10 cashback' },
      ];
      mockCacheManager.get.mockResolvedValue(cachedOptions);

      const result = await service.getRewardOptions();

      expect(result).toEqual(cachedOptions);
    });

    it('should return default reward options and cache them', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await service.getRewardOptions();

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('cashback');
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });
});
