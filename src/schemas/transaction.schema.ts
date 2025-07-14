import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @ApiProperty({ description: 'User ID' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'Transaction amount' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Transaction category' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ description: 'Points earned from transaction' })
  @Prop({ required: true })
  pointsEarned: number;

  @ApiProperty({ description: 'Transaction timestamp' })
  @Prop({ default: Date.now })
  timestamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
