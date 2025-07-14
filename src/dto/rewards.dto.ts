import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsEnum } from 'class-validator';

export class RedeemPointsDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Points to redeem' })
  @IsNumber()
  @IsPositive()
  pointsToRedeem: number;

  @ApiProperty({ description: 'Reward type', enum: ['cashback', 'voucher', 'gift-card'] })
  @IsEnum(['cashback', 'voucher', 'gift-card'])
  rewardType: string;
}

export class CreateTransactionDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Transaction category' })
  @IsString()
  category: string;
}

export class GetTransactionsDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 5 })
  @IsNumber()
  @IsPositive()
  limit?: number = 5;
}
