import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderbookService } from './orderbook.service';

@WebSocketGateway()
export class OrderbookGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private orderbookService: OrderbookService) {}

  private logger: Logger = new Logger('OrderbookGateway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('Websocket server initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('midprice')
  async handleSendMidprice(client: Socket, payload: string): Promise<void> {
    setInterval(async () => {
      const midPrice = await this.orderbookService.getMidPrice();
      this.wss.emit('midprice', midPrice);
    }, 1000);
  }

  @SubscribeMessage('orderbook')
  async handleSendOrderbook(client: Socket, payload: string): Promise<void> {
    setInterval(async () => {
      const orderbook = await this.orderbookService.getOrderbook();
      this.wss.emit('orderbook', orderbook);
    }, 1000);
  }
}
