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
    this.initWebSocket();
    this.logger = new Logger(`${this.name}OrderbookService`);
  }

  getMidPrice(): number {
    if (this.asks.length > 0 && this.bids.length > 0) {
      return (this.asks[0][0] + this.bids[0][0]) / 2;
    }

    return null;
  }

  getLevels(): { a: OrderbookLevel[]; b: OrderbookLevel[] } {
    return {
      a: this.asks,
      b: this.bids,
    };
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
      this.initWebSocket();
    });

    this.wsClient.on('error', (error) => {
      this.logger.error(`${this.name} WebSocket error: ${error}`);
    });
  }

  private subscribeToOrderBook() {
    this.wsClient.send(JSON.stringify(this.subscriptionMessage));
  }

  protected async handleData(data: WebSocket.Data) {}

  protected setAsks(asks: OrderbookLevel[]) {
    this.asks = asks;
    this.verifyLevels(asks, true);
  }
  protected setBids(bids: OrderbookLevel[]) {
    this.bids = bids;
    this.verifyLevels(bids, false);
  }

  private verifyLevels(levels: OrderbookLevel[], isIncreasing: boolean) {
    let levelsError = false;
    for (let index = 0; index < levels.length - 2; index++) {
      if (isIncreasing && levels[index][0] >= levels[index + 1][0]) {
        console.log('increasing', levels[index], levels[index + 1]);
        levelsError = true;
        break;
      } else if (!isIncreasing && levels[index][0] <= levels[index + 1][0]) {
        console.log('decreasing', levels[index], levels[index + 1]);
        levelsError = true;
        break;
      }
    }

    if (levelsError) {
      console.log(isIncreasing);
      this.logger.warn(`Levels error: ${this.name}`);
      this.logger.warn(levels);
    } else {
      // this.logger.log(`Ok: ${this.name}`);
    }
  }
}
