import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Reward, RewardSchema } from '../schemas/reward.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Redemption, RedemptionSchema } from '../schemas/redemption.schema';
import { RewardsGateway } from '../websocket/rewards.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService, RewardsGateway],
  exports: [RewardsService],
})
export class RewardsModule {}
