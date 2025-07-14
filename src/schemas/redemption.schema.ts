import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RedemptionDocument = Redemption & Document;

@Schema({ timestamps: true })
export class Redemption {
  @ApiProperty({ description: 'User ID' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'Points redeemed' })
  @Prop({ required: true })
  pointsRedeemed: number;

  @ApiProperty({ description: 'Type of reward redeemed' })
  @Prop({ required: true })
  rewardType: string;

  @ApiProperty({ description: 'Redemption timestamp' })
  @Prop({ default: Date.now })
  timestamp: Date;
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption);
