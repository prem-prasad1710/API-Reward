import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, UserDocument } from '../schemas/user.schema';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { Redemption, RedemptionDocument } from '../schemas/redemption.schema';
import { RedeemPointsDto, CreateTransactionDto, GetTransactionsDto } from '../dto/rewards.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Redemption.name) private redemptionModel: Model<RedemptionDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUserPoints(userId: string): Promise<{ userId: string; totalPoints: number }> {
    // Check cache first
    const cacheKey = `user_points_${userId}`;
    const cachedPoints = await this.cacheManager.get(cacheKey);
    
    if (cachedPoints) {
      return cachedPoints as { userId: string; totalPoints: number };
    }

    const reward = await this.rewardModel.findOne({ userId });
    if (!reward) {
      throw new NotFoundException('User rewards not found');
    }

    const result = { userId, totalPoints: reward.totalPoints };
    
    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);
    
    return result;
  }

  async getTransactions(params: GetTransactionsDto): Promise<{
    transactions: Transaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { userId, page = 1, limit = 5 } = params;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments({ userId }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async redeemPoints(redeemData: RedeemPointsDto): Promise<{
    success: boolean;
    message: string;
    redemption?: Redemption;
    remainingPoints?: number;
  }> {
    const { userId, pointsToRedeem, rewardType } = redeemData;

    // Check if user has enough points
    const userReward = await this.rewardModel.findOne({ userId });
    if (!userReward) {
      throw new NotFoundException('User rewards not found');
    }

    if (userReward.totalPoints < pointsToRedeem) {
      throw new BadRequestException(
        `Insufficient points. Available: ${userReward.totalPoints}, Required: ${pointsToRedeem}`,
      );
    }

    // Create redemption record
    const redemption = new this.redemptionModel({
      userId,
      pointsRedeemed: pointsToRedeem,
      rewardType,
    });

    // Deduct points from user's account
    userReward.totalPoints -= pointsToRedeem;
    userReward.updatedAt = new Date();

    // Save both records
    await Promise.all([redemption.save(), userReward.save()]);

    // Clear cache
    await this.cacheManager.del(`user_points_${userId}`);

    return {
      success: true,
      message: 'Points redeemed successfully',
      redemption,
      remainingPoints: userReward.totalPoints,
    };
  }

  async getRewardOptions(): Promise<Array<{
    type: string;
    name: string;
    pointsRequired: number;
    description: string;
  }>> {
    // Check cache first
    const cacheKey = 'reward_options';
    const cachedOptions = await this.cacheManager.get(cacheKey);
    
    if (cachedOptions) {
      return cachedOptions as Array<{
        type: string;
        name: string;
        pointsRequired: number;
        description: string;
      }>;
    }

    const rewardOptions = [
      {
        type: 'cashback',
        name: 'Cashback',
        pointsRequired: 100,
        description: '₹10 cashback to your account',
      },
      {
        type: 'voucher',
        name: 'Shopping Voucher',
        pointsRequired: 500,
        description: '₹50 shopping voucher',
      },
      {
        type: 'gift-card',
        name: 'Gift Card',
        pointsRequired: 1000,
        description: '₹100 gift card',
      },
    ];

    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, rewardOptions, 3600000);
    
    return rewardOptions;
  }

  async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    const { userId, amount, category } = transactionData;

    // Calculate points earned (1 point per ₹10 spent)
    const pointsEarned = Math.floor(amount / 10);

    // Create transaction
    const transaction = new this.transactionModel({
      userId,
      amount,
      category,
      pointsEarned,
    });

    // Update user's total points
    await this.rewardModel.findOneAndUpdate(
      { userId },
      { 
        $inc: { totalPoints: pointsEarned },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    // Clear cache
    await this.cacheManager.del(`user_points_${userId}`);

    return transaction.save();
  }

  async seedMockData(): Promise<{ message: string }> {
    // Check if data already exists
    const existingUsers = await this.userModel.countDocuments();
    if (existingUsers > 0) {
      return { message: 'Mock data already exists' };
    }

    // Create mock users
    const mockUsers = [
      { userId: 'user_1', name: 'John Doe', email: 'john@example.com' },
      { userId: 'user_2', name: 'Jane Smith', email: 'jane@example.com' },
      { userId: 'user_3', name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    await this.userModel.insertMany(mockUsers);

    // Create mock transactions and rewards
    for (const user of mockUsers) {
      let totalPoints = 0;
      
      // Create 10 mock transactions per user
      for (let i = 0; i < 10; i++) {
        const amount = Math.floor(Math.random() * 500) + 50;
        const pointsEarned = Math.floor(amount / 10);
        totalPoints += pointsEarned;

        const categories = ['Food', 'Shopping', 'Entertainment', 'Travel', 'Utilities'];
        const category = categories[Math.floor(Math.random() * categories.length)];

        await this.transactionModel.create({
          userId: user.userId,
          amount,
          category,
          pointsEarned,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        });
      }

      // Create reward record
      await this.rewardModel.create({
        userId: user.userId,
        totalPoints,
      });
    }

    return { message: 'Mock data seeded successfully' };
  }
}
