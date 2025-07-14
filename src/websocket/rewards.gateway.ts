import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RewardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('RewardsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emit points update to specific user
  emitPointsUpdate(userId: string, totalPoints: number) {
    this.server.emit(`points-update-${userId}`, {
      userId,
      totalPoints,
      timestamp: new Date(),
    });
  }

  // Emit transaction created notification
  emitTransactionCreated(userId: string, transaction: any) {
    this.server.emit(`transaction-created-${userId}`, {
      userId,
      transaction,
      timestamp: new Date(),
    });
  }

  // Emit redemption notification
  emitRedemptionSuccess(userId: string, redemption: any) {
    this.server.emit(`redemption-success-${userId}`, {
      userId,
      redemption,
      timestamp: new Date(),
    });
  }
}
