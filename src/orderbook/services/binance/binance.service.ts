import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { BinanceOrderbookResponse } from './binance.types';
import { BaseOrderbookService } from '../orderbook.service';
import { OrderbookLevel } from '../orderbook.types';

@Injectable()
@WebSocketGateway()
export class BinanceOrderbookService extends BaseOrderbookService {
  constructor() {
    const name = 'Binance';
    const wssUrl = 'wss://stream.binance.com:9443/ws';
    const subscriptionMessage = {
      method: 'SUBSCRIBE',
      params: ['btcusdt@depth'],
      id: 1,
    };
    super(name, wssUrl, subscriptionMessage);
  }

  protected async handleData(data: WebSocket.Data) {
    const parsedData: BinanceOrderbookResponse = JSON.parse(data.toString());

    if (parsedData?.a) {
      // console.log(parsedData.tick.asks);
      const asks = parsedData.a.map((level) => {
        return [Number(level[0]), Number(level[1])];
      }) as OrderbookLevel[];
      this.setAsks(asks);
    }
    if (parsedData?.b) {
      // console.log(parsedData.tick.bids);
      const bids = parsedData.b.map((level) => {
        return [Number(level[0]), Number(level[1])];
      }) as OrderbookLevel[];
      this.setBids(bids);
    }
  }
}
