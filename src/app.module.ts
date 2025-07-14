import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RewardsModule } from './rewards/rewards.module';
import { AnalyticsModule } from './analytics/analytics.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Database
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rewards-api',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    // Cache (Redis) - Optional, falls back to in-memory if Redis is not available
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        try {
          return {
            store: redisStore as any,
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            ttl: 300, // 5 minutes default TTL
          };
        } catch (error) {
          // Fallback to in-memory cache if Redis is not available
          console.warn('Redis not available, using in-memory cache');
          return {
            ttl: 300,
          };
        }
      },
    }),

    // Feature modules
    RewardsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
