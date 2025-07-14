import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { Redemption, RedemptionDocument } from '../schemas/redemption.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Redemption.name) private redemptionModel: Model<RedemptionDocument>,
  ) {}

  async getRewardsDistribution(): Promise<{
    categoryDistribution: Array<{ category: string; totalPoints: number; transactionCount: number }>;
    redemptionDistribution: Array<{ rewardType: string; totalRedemptions: number; pointsRedeemed: number }>;
    summary: {
      totalPointsEarned: number;
      totalPointsRedeemed: number;
      totalTransactions: number;
      totalRedemptions: number;
    };
  }> {
    // Aggregate transactions by category
    const categoryDistribution = await this.transactionModel.aggregate([
      {
        $group: {
          _id: '$category',
          totalPoints: { $sum: '$pointsEarned' },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalPoints: 1,
          transactionCount: 1,
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    // Aggregate redemptions by reward type
    const redemptionDistribution = await this.redemptionModel.aggregate([
      {
        $group: {
          _id: '$rewardType',
          totalRedemptions: { $sum: 1 },
          pointsRedeemed: { $sum: '$pointsRedeemed' },
        },
      },
      {
        $project: {
          _id: 0,
          rewardType: '$_id',
          totalRedemptions: 1,
          pointsRedeemed: 1,
        },
      },
      { $sort: { pointsRedeemed: -1 } },
    ]);

    // Calculate summary statistics
    const [summaryStats] = await Promise.all([
      this.transactionModel.aggregate([
        {
          $group: {
            _id: null,
            totalPointsEarned: { $sum: '$pointsEarned' },
            totalTransactions: { $sum: 1 },
          },
        },
      ]),
    ]);

    const [redemptionStats] = await this.redemptionModel.aggregate([
      {
        $group: {
          _id: null,
          totalPointsRedeemed: { $sum: '$pointsRedeemed' },
          totalRedemptions: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      totalPointsEarned: summaryStats?.[0]?.totalPointsEarned || 0,
      totalPointsRedeemed: redemptionStats?.[0]?.totalPointsRedeemed || 0,
      totalTransactions: summaryStats?.[0]?.totalTransactions || 0,
      totalRedemptions: redemptionStats?.[0]?.totalRedemptions || 0,
    };

    return {
      categoryDistribution,
      redemptionDistribution,
      summary,
    };
  }
}
