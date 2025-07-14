import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @ApiProperty({ description: 'User ID' })
  @Prop({ required: true, unique: true })
  userId: string;

  @ApiProperty({ description: 'Total reward points' })
  @Prop({ required: true, default: 0 })
  totalPoints: number;

  @ApiProperty({ description: 'Last updated timestamp' })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
