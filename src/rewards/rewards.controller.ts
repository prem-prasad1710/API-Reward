import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { RedeemPointsDto, CreateTransactionDto, GetTransactionsDto } from '../dto/rewards.dto';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points')
  @ApiOperation({ summary: 'Get total reward points for a user' })
  @ApiQuery({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User points retrieved successfully',
    schema: {
      properties: {
        userId: { type: 'string' },
        totalPoints: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User rewards not found',
  })
  async getPoints(@Query('userId') userId: string) {
    return this.rewardsService.getUserPoints(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get last transactions that earned reward points with pagination' })
  @ApiQuery({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    schema: {
      properties: {
        transactions: {
          type: 'array',
          items: {
            properties: {
              userId: { type: 'string' },
              amount: { type: 'number' },
              category: { type: 'string' },
              pointsEarned: { type: 'number' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getTransactions(
    @Query(new ValidationPipe({ transform: true })) query: GetTransactionsDto,
  ) {
    return this.rewardsService.getTransactions(query);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem reward points for a specific option' })
  @ApiBody({ type: RedeemPointsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Points redeemed successfully',
    schema: {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        redemption: {
          properties: {
            userId: { type: 'string' },
            pointsRedeemed: { type: 'number' },
            rewardType: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        remainingPoints: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Insufficient points or invalid request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User rewards not found',
  })
  async redeemPoints(@Body(ValidationPipe) redeemData: RedeemPointsDto) {
    return this.rewardsService.redeemPoints(redeemData);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get available reward options' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward options retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          pointsRequired: { type: 'number' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getRewardOptions() {
    return this.rewardsService.getRewardOptions();
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Create a new transaction (for testing purposes)' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction created successfully',
  })
  async createTransaction(@Body(ValidationPipe) transactionData: CreateTransactionDto) {
    return this.rewardsService.createTransaction(transactionData);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed mock data for testing' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mock data seeded successfully',
  })
  async seedMockData() {
    return this.rewardsService.seedMockData();
  }
}
