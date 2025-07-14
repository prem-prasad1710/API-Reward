import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'User ID' })
  @Prop({ required: true, unique: true })
  userId: string;

  @ApiProperty({ description: 'User name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'User email' })
  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
