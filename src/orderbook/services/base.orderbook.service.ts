import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Orderbook, OrderbookLevel } from './orderbook.types';
import { Cron } from '@nestjs/schedule';

export class BaseOrderbookService {
  private wsClient: WebSocket;

  protected asks: OrderbookLevel[] = [];
  protected bids: OrderbookLevel[] = [];
  private lastUpdatedAt: number;
  protected orderbookStaleTime = 1000 * 10;
  private logger: Logger;
  private shouldReconnect = true;

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

  getOrderbook(): Orderbook {
    return {
      a: this.asks,
      b: this.bids,
    };
  }

  @Cron('*/5 * * * * *')
  cronCheckOrderbookStale() {
    const timeSinceLastUpdate = Date.now() - this.lastUpdatedAt;
    const orderbookIsStale = timeSinceLastUpdate > this.orderbookStaleTime;
    if (orderbookIsStale) {
      this.logger.warn(`Orderbook is stale: ${this.name}`);
      this.resetOrderbook();
      this.closeWebsocket();
      this.initWebSocket();
    }
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

      if (this.shouldReconnect) {
        this.initWebSocket();
      }
    });

    this.wsClient.on('error', (error) => {
      this.logger.error(`${this.name} WebSocket error: ${error}`);
    });
  }

  private closeWebsocket() {
    this.shouldReconnect = false;
    this.wsClient.close();
  }

  private subscribeToOrderBook() {
    this.wsClient.send(JSON.stringify(this.subscriptionMessage));
  }

  protected async handleData(data: WebSocket.Data) {}

  public setAsks(asks: OrderbookLevel[]) {
    this.asks = asks;
    this.lastUpdatedAt = Date.now();
    this.verifyLevels(asks, true);
  }
  public setBids(bids: OrderbookLevel[]) {
    this.bids = bids;
    this.lastUpdatedAt = Date.now();
    this.verifyLevels(bids, false);
  }
  public resetOrderbook() {
    this.setAsks([]);
    this.setBids([]);
  }

  private verifyLevels(levels: OrderbookLevel[], isIncreasing: boolean) {
    const levelsError = this.isError(levels, isIncreasing);
    if (levelsError) {
      console.log(isIncreasing);
      this.logger.warn(`Levels error: ${this.name}`);
      this.logger.warn(levels);
    } else {
      // this.logger.log(`Ok: ${this.name}`);
    }
  }

  private isError(levels: OrderbookLevel[], isIncreasing: boolean): boolean {
    if (levels.length < 1) return false;

    let index = 0;
    while (index < levels.length - 1) {
      if (isIncreasing && levels[index][0] >= levels[index + 1][0]) {
        return true;
      } else if (!isIncreasing && levels[index][0] <= levels[index + 1][0]) {
        return true;
      }

      index++;
    }

    return false;
  }
}
