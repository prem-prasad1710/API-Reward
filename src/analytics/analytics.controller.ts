import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('rewards-distribution')
  @ApiOperation({ summary: 'Get rewards distribution analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics data retrieved successfully',
    schema: {
      properties: {
        categoryDistribution: {
          type: 'array',
          items: {
            properties: {
              category: { type: 'string' },
              totalPoints: { type: 'number' },
              transactionCount: { type: 'number' },
            },
          },
        },
        redemptionDistribution: {
          type: 'array',
          items: {
            properties: {
              rewardType: { type: 'string' },
              totalRedemptions: { type: 'number' },
              pointsRedeemed: { type: 'number' },
            },
          },
        },
        summary: {
          properties: {
            totalPointsEarned: { type: 'number' },
            totalPointsRedeemed: { type: 'number' },
            totalTransactions: { type: 'number' },
            totalRedemptions: { type: 'number' },
          },
        },
      },
    },
  })
  async getRewardsDistribution() {
    return this.analyticsService.getRewardsDistribution();
  }
}
