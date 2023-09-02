import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { OrderbookLevel } from './orderbook.types';

export class BaseOrderbookService {
  private wsClient: WebSocket;

  protected asks: OrderbookLevel[] = [];
  protected bids: OrderbookLevel[] = [];
  private logger: Logger;

  constructor(
    public name: string,
    public wssUrl: string,
    public subscriptionMessage: Object,
  ) {
    console.log(this);
    this.initWebSocket();
    this.logger = new Logger(`${this.name}OrderbookService`);
  }

  getMidPrice(): number {
    if (this.asks.length > 0 && this.bids.length > 0) {
      return (this.asks[0][0] + this.bids[0][0]) / 2;
    }

    return null;
  }

  private initWebSocket() {
    this.wsClient = new WebSocket(this.wssUrl);

    this.wsClient.on('open', () => {
      this.logger.log(`Connected to ${this.name} WebSocket`);

      // Subscribe to order book updates or perform any necessary actions
      this.subscribeToOrderBook();
    });

    this.wsClient.on('message', (data) => {
      this.handleData(data);
    });

    this.wsClient.on('close', () => {
      this.logger.log(`Disconnected from ${this.name} WebSocket`);
      // Handle WebSocket closure or reconnect logic
    });

    this.wsClient.on('error', (error) => {
      this.logger.error(`${this.name} WebSocket error: ${error}`);
    });
  }

  private subscribeToOrderBook() {
    this.wsClient.send(JSON.stringify(this.subscriptionMessage));
  }

  protected async handleData(data: WebSocket.Data) {}
}
